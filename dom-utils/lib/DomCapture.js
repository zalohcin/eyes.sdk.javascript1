'use strict';

const fs = require('fs');
const path = require('path');

const url = require('url');
const isAbsoluteUrl = require('is-absolute-url');
const axios = require('axios');
const cssParser = require('css');
const cssUrlParser = require('css-url-parser');

const { Location, PerformanceUtils } = require('@applitools/eyes.sdk.core');

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

    const dom = await this.getWindowDom(logger, driver);

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
      ignoredTagNames: ['HEAD', 'SCRIPT'],
    };

    return DomCapture._getFrameDom(logger, driver, argsObj);
  }

  /**
   * @param {Logger} logger
   * @param {EyesWebDriver} driver
   * @param {object} argsObj
   * @return {Promise.<object>}
   * @private
   */
  static async _getFrameDom(logger, driver, argsObj) {
    try {
      const json = await driver.executeScript(DomCapture.CAPTURE_FRAME_SCRIPT, argsObj);
      const currentUrl = await driver.getCurrentUrl();

      const domTree = JSON.parse(json);

      await DomCapture._traverseDomTree(logger, driver, argsObj, domTree, -1, currentUrl);

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
  static async _traverseDomTree(logger, driver, argsObj, domTree, frameIndex, baseUri) {
    if (!domTree.tagName) {
      return;
    }

    const tagNameObj = domTree.tagName;

    if (frameIndex > -1) {
      let timeStart = PerformanceUtils.start();
      await driver.switchTo().frame(frameIndex);
      logger.verbose(`switching to frame took ${timeStart.end().summary}`);

      timeStart = PerformanceUtils.start();
      const json = await driver.executeScript(DomCapture.CAPTURE_FRAME_SCRIPT, argsObj);
      logger.verbose(`executing javascript to capture frame's script took ${timeStart.end().summary}`);

      const dom = JSON.parse(json);

      domTree.childNodes = dom;
      let srcUrl = null;
      if (domTree.attributes) {
        const attrsNodeObj = domTree.attributes;
        const attrsNode = attrsNodeObj;
        if (attrsNode.src) {
          const srcUrlObj = attrsNode.src;
          srcUrl = srcUrlObj.toString();
        }
      }
      if (srcUrl == null) {
        logger.verbose('WARNING! IFRAME WITH NO SRC');
      }

      const srcUri = url.resolve(baseUri, srcUrl);
      await DomCapture._traverseDomTree(logger, driver, argsObj, dom, -1, srcUri);

      timeStart = PerformanceUtils.start();
      await driver.switchTo().parentFrame();
      logger.verbose(`switching to parent frame took ${timeStart.end().summary}`);
    }

    const tagName = tagNameObj;
    const isHTML = tagName.toUpperCase() === 'HTML';

    if (isHTML) {
      const css = await DomCapture.getFrameBundledCss(logger, driver, baseUri);
      domTree.css = css;
    }

    await DomCapture._loop(logger, driver, argsObj, domTree, baseUri);
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
  static async _loop(logger, driver, argsObj, domTree, baseUri) {
    if (!domTree.childNodes) {
      return;
    }

    const childNodes = domTree.childNodes;
    let index = 0;

    const timeStart = PerformanceUtils.start();
    for (const node of childNodes) {
      const domSubTree = node;
      if (domSubTree) {
        const tagName = domSubTree.tagName;
        const isIframe = tagName.toUpperCase() === 'IFRAME';

        if (isIframe) {
          await DomCapture._traverseDomTree(logger, driver, argsObj, domSubTree, index, baseUri);
          index += 1;
        } else {
          const childSubNodesObj = domSubTree.childNodes;
          if (!childSubNodesObj || childSubNodesObj.length === 0) {
            continue;
          }

          await DomCapture._traverseDomTree(logger, driver, argsObj, domSubTree, -1, baseUri);
          return;
        }
      }
    }
    logger.verbose(`looping through ${childNodes.length} child nodes (out of which ${index} inner iframes) took ${timeStart.end().summary}`);
  }

  /**
   * @param {Logger} logger
   * @param {EyesWebDriver} driver
   * @param {string} baseUri
   * @return {Promise<string>}
   */
  static async getFrameBundledCss(logger, driver, baseUri) {
    if (!isAbsoluteUrl(baseUri)) {
      logger.verbose('WARNING! Base URL is not an absolute URL!');
    }

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
        css = await DomCapture._parseAndSerializeCss(logger, baseUri, value);
      } else {
        css = await DomCapture._downloadCss(logger, baseUri, value);
      }
      css = await DomCapture._parseAndSerializeCss(logger, baseUri, css);
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
  static async _parseAndSerializeCss(logger, baseUri, css) {
    const timeStart = PerformanceUtils.start();
    const stylesheet = cssParser.parse(css);
    logger.verbose(`parsing CSS string took ${timeStart.end().summary}`);

    css = await DomCapture._serializeCss(logger, baseUri, stylesheet.stylesheet);
    return css;
  }

  /**
   * @param {Logger} logger
   * @param {string} baseUri
   * @param {object} stylesheet
   * @return {Promise<string>}
   * @private
   */
  static async _serializeCss(logger, baseUri, stylesheet) {
    const timeStart = PerformanceUtils.start();
    let sb = '';

    let css;
    for (const ruleSet of stylesheet.rules) {
      let addAsIs = true;
      if (ruleSet.type === 'import') {
        logger.verbose('encountered @import rule');
        const href = cssUrlParser(ruleSet.import);
        css = await DomCapture._downloadCss(logger, baseUri, href[0]);
        css = css.trim();
        logger.verbose('imported CSS (whitespaces trimmed) length: {0}', css.length);
        addAsIs = css.length === 0;
        if (!addAsIs) {
          css = await DomCapture._parseAndSerializeCss(logger, baseUri, css);
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
   * @return {Promise<string>}
   * @private
   */
  static async _downloadCss(logger, baseUri, value) {
    try {
      logger.verbose('Given URL to download: {0}', value);
      // let href = cssParser.parse(value);
      let href = value;
      if (!isAbsoluteUrl(href)) {
        href = url.resolve(baseUri, href.toString());
      }

      const timeStart = PerformanceUtils.start();
      const response = await axios(href);
      const css = response.data;
      logger.verbose(`downloading CSS in length of ${css.length} chars took ${timeStart.end().summary}`);
      return Promise.resolve(css);
    } catch (ex) {
      logger.verbose(ex.toString());
      return '';
    }
  }
}

exports.DomCapture = DomCapture;
