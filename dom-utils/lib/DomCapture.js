'use strict';

const fs = require('fs');
const path = require('path');

const url = require('url');
const axios = require('axios');
const cssParser = require('css');
const cssUrlParser = require('css-url-parser');

const { Location, GeneralUtils, PerformanceUtils } = require('@applitools/eyes-sdk-core');

class DomCapture {
  static get CAPTURE_FRAME_SCRIPT() {
    const scriptPath = path.join(__dirname, './resources/CaptureFrame.js');
    const buffer = fs.readFileSync(scriptPath);
    return buffer.toString();
  }

  static get CAPTURE_CSSOM_SCRIPT() {
    const scriptPath = path.join(__dirname, './resources/CaptureCssom.js');
    const buffer = fs.readFileSync(scriptPath);
    return buffer.toString();
  }

  constructor() {
    this._level = 0;
    this._frameIndices = [0];
  }

  /**
   * @param {Logger} logger A Logger instance.
   * @param {EyesWebDriver} driver
   * @param {PositionProvider} [positionProvider]
   * @return {Promise.<string>}
   */
  static async getFullWindowDom(logger, driver, positionProvider) {
    let originalPosition;
    if (positionProvider) {
      originalPosition = await positionProvider.getState();
      await positionProvider.setPosition(Location.ZERO);
    }

    const dom = await DomCapture.getWindowDom(logger, driver);

    if (positionProvider) {
      await positionProvider.restoreState(originalPosition);
    }

    return JSON.stringify(dom);
  }

  /**
   * @param {Logger} logger A Logger instance.
   * @param {EyesWebDriver} driver
   * @return {Promise.<string>}
   */
  static getWindowDom(logger, driver) {
    const argsObj = {
      styleProps: [
        'background-color',
        'background-image',
        'background-size',
        'color',
        'border-width',
        'border-color',
        'border-style',
        'padding',
        'margin',
      ],
      attributeProps: null,
      /*
      [
        {all: ["id", "class"]},
        {IMG: ["src"]},
        {IFRAME: ["src"]},
        {A: ["href"]},
      ]
      */
      rectProps: [
        'width',
        'height',
        'top',
        'left',
      ],
      ignoredTagNames: [
        'HEAD',
        'SCRIPT',
      ],
    };

    const domCapture = new DomCapture();
    return domCapture._getFrameDom(logger, driver, argsObj);
  }

  /**
   * @param {Logger} logger
   * @param {EyesWebDriver} driver
   * @param {object} argsObj
   * @return {Promise.<object>}
   * @private
   */
  async _getFrameDom(logger, driver, argsObj) {
    try {
      const json = await driver.executeScript(DomCapture.CAPTURE_FRAME_SCRIPT, argsObj);
      const domTree = JSON.parse(json);

      const currentUrl = await driver.getCurrentUrl();
      await this._traverseDomTree(logger, driver, argsObj, domTree, -1, currentUrl);

      return domTree;
    } catch (e) {
      throw new Error(`Error: ${e}`);
    }
  }

  /**
   * @param {Logger} logger
   * @param {EyesWebDriver} driver
   * @param {object} argsObj
   * @param {object} domTree
   * @param {number} frameIndex
   * @param {string} baseUri
   * @return {Promise<void>}
   * @private
   */
  async _traverseDomTree(logger, driver, argsObj, domTree, frameIndex, baseUri) {
    const tagNameObj = domTree.tagName;
    if (!tagNameObj) return;

    let frameHasContent = true;
    if (frameIndex > -1) {
      this._level += 1;
      logger.verbose(`switching to frame ${frameIndex} (level: ${this._level})`);
      let timeStart = PerformanceUtils.start();
      await driver.switchTo().frame(frameIndex);
      this._frameIndices.push(0);
      logger.verbose(`switching to frame took ${timeStart.end().summary}`);

      const childNodesObj = domTree.childNodes;
      if (!childNodesObj || childNodesObj.length) {
        frameHasContent = false;
        timeStart = PerformanceUtils.start();
        const json = await driver.executeScript(DomCapture.CAPTURE_FRAME_SCRIPT, argsObj);
        logger.verbose(`executing javascript to capture frame's script took ${timeStart.end().summary}`);
        const dom = JSON.parse(json);

        domTree.childNodes = [dom];

        let srcUrl = null;
        const attrsNode = domTree.attributes;
        if (attrsNode) {
          const srcUrlObj = attrsNode.src;
          if (srcUrlObj) {
            srcUrl = srcUrlObj.toString();
          }
        }
        if (!srcUrl) {
          logger.verbose('WARNING! IFRAME WITH NO SRC');
        }

        const srcUri = url.resolve(baseUri, srcUrl);
        await this._traverseDomTree(logger, driver, argsObj, dom, -1, srcUri);
      }

      timeStart = PerformanceUtils.start();
      await driver.switchTo().parentFrame();
      this._level -= 1;
      this._frameIndices.pop();
      logger.verbose(`switching to parent frame took ${timeStart.end().summary}`);
    }

    if (frameHasContent) {
      const tagName = tagNameObj;
      const isHTML = tagName.toUpperCase() === 'HTML';

      if (isHTML) {
        const css = await this._getFrameBundledCss(logger, driver, baseUri);
        domTree.css = css;
      }

      await this._loop(logger, driver, argsObj, domTree, baseUri);
    }
  }

  /**
   * @param {Logger} logger
   * @param {EyesWebDriver} driver
   * @param {object} argsObj
   * @param {object} domTree
   * @param {string} baseUri
   * @return {Promise<void>}
   * @private
   */
  async _loop(logger, driver, argsObj, domTree, baseUri) {
    const childNodes = domTree.childNodes;
    if (!childNodes) return;

    let index = this._frameIndices[this._frameIndices.length - 1];
    for (const domSubTree of childNodes) {
      if (domSubTree) {
        const tagName = domSubTree.tagName;
        const isIframe = tagName.toUpperCase() === 'IFRAME';

        if (isIframe) {
          this._frameIndices.pop();
          this._frameIndices.push(index + 1);
          await this._traverseDomTree(logger, driver, argsObj, domSubTree, index, baseUri);
          index += 1;
        } else {
          const childSubNodesObj = domSubTree.childNodes;
          if (!childSubNodesObj || childSubNodesObj.length === 0) continue;
          await this._traverseDomTree(logger, driver, argsObj, domSubTree, -1, baseUri);
        }
      }
    }
  }

  /**
   * @param {Logger} logger
   * @param {EyesWebDriver} driver
   * @param {string} baseUri
   * @return {Promise<string>}
   * @private
   */
  async _getFrameBundledCss(logger, driver, baseUri) {
    if (!GeneralUtils.isAbsoluteUrl(baseUri)) {
      logger.verbose('WARNING! Base URL is not an absolute URL!');
    }

    logger.verbose(`enter with baseUri: ${baseUri} (level ${this._level})`);

    let sb = '';
    let timeStart = PerformanceUtils.start();
    const result = await driver.executeScript(DomCapture.CAPTURE_CSSOM_SCRIPT);
    logger.verbose(`executing javascript to capture css took ${timeStart.end().summary}`);
    for (const item of result) {
      timeStart = PerformanceUtils.start();
      const kind = item.substring(0, 5);
      const value = item.substring(5);
      logger.verbose(`splitting css result item took ${timeStart.end().summary}`);
      let css;
      if (kind === 'text:') {
        css = await this._parseAndSerializeCss(logger, baseUri, value);
      } else {
        css = await this._downloadCss(logger, baseUri, value);
      }
      css = await this._parseAndSerializeCss(logger, baseUri, css);
      timeStart = PerformanceUtils.start();
      sb += css;
      logger.verbose(`appending CSS to StringBuilder took ${timeStart.end().summary}`);
    }
    return sb;
  }

  /**
   * @param {Logger} logger
   * @param {string} baseUri
   * @param {string} css
   * @return {Promise<string>}
   * @private
   */
  async _parseAndSerializeCss(logger, baseUri, css) {
    const timeStart = PerformanceUtils.start();
    const stylesheet = cssParser.parse(css);
    logger.verbose(`parsing CSS string took ${timeStart.end().summary}`);

    css = await this._serializeCss(logger, baseUri, stylesheet.stylesheet);
    return css;
  }

  /**
   * @param {Logger} logger
   * @param {string} baseUri
   * @param {object} stylesheet
   * @return {Promise<string>}
   * @private
   */
  async _serializeCss(logger, baseUri, stylesheet) {
    const timeStart = PerformanceUtils.start();
    let sb = '';

    let css;
    for (const ruleSet of stylesheet.rules) {
      let addAsIs = true;
      if (ruleSet.type === 'import') {
        logger.verbose('encountered @import rule');
        const href = cssUrlParser(ruleSet.import);
        css = await this._downloadCss(logger, baseUri, href[0]);
        css = css.trim();
        logger.verbose('imported CSS (whitespaces trimmed) length: {0}', css.length);
        addAsIs = css.length === 0;
        if (!addAsIs) {
          css = await this._parseAndSerializeCss(logger, baseUri, css);
          sb += css;
        }
      }

      if (addAsIs) {
        const node = {
          stylesheet: {
            rules: [ruleSet],
          },
        };
        sb += cssParser.stringify(node, { compress: true });

        // sb += ruleSet.toString();
        // sb += css;
      }
    }

    logger.verbose(`serializing CSS to StringBuilder took ${timeStart.end().summary}`);
    return sb.toString();
  }

  /**
   * @param {Logger} logger
   * @param {string} baseUri
   * @param {string} value
   * @param {number} [retriesCount=1]
   * @return {Promise<string>}
   * @private
   */
  async _downloadCss(logger, baseUri, value, retriesCount = 1) {
    try {
      logger.verbose('Given URL to download: {0}', value);
      // let href = cssParser.parse(value);
      let href = value;
      if (!GeneralUtils.isAbsoluteUrl(href)) {
        href = url.resolve(baseUri, href.toString());
      }

      const timeStart = PerformanceUtils.start();
      const response = await axios(href);
      const css = response.data;
      logger.verbose(`downloading CSS in length of ${css.length} chars took ${timeStart.end().summary}`);
      return css;
    } catch (ex) {
      logger.verbose(ex.toString());
      if (retriesCount > 0) {
        retriesCount -= 1;
        return this._downloadCss(logger, baseUri, value, retriesCount);
      }
      return '';
    }
  }
}

exports.DomCapture = DomCapture;
