'use strict';

const fs = require('fs');
const path = require('path');

const url = require('url');
const axios = require('axios');
const shadyCss = require('shady-css-parser');
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

  /**
   * @param {Logger} logger
   * @param {EyesWebDriver|WebDriver} driver
   */
  constructor(logger, driver) {
    this._logger = logger;
    this._driver = driver;

    this._frameBundledCssPromises = [];
  }

  /**
   * @param {Logger} logger A Logger instance.
   * @param {EyesWebDriver|WebDriver} driver
   * @param {PositionProvider} [positionProvider]
   * @return {Promise<string>}
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
   * @return {Promise<string>}
   */
  static async getWindowDom(logger, driver) {
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

    const json = await driver.executeScript(DomCapture.CAPTURE_FRAME_SCRIPT, argsObj);
    const domTree = JSON.parse(json);

    const domCapture = new DomCapture(logger, driver);
    await domCapture._getFrameDom({ childNodes: [domTree], tagName: 'OUTER_HTML' });
    await Promise.all(domCapture._frameBundledCssPromises);
    return domTree;
  }

  /**
   * @param {object} domTree
   * @return {Promise<object>}
   * @private
   */
  async _getFrameDom(domTree) {
    const { tagName } = domTree;

    if (!tagName) {
      return;
    }

    let frameIndex = 0;

    await this._loop(domTree, async domSubTree => {
      await this._driver.switchTo().frame(frameIndex);
      await this._getFrameDom(domSubTree);
      await this._driver.switchTo().parentFrame();
      frameIndex += 1;
    });
  }

  /**
   * @param {object} domTree
   * @param {function} fn
   * @return {Promise<void>}
   * @private
   */
  async _loop(domTree, fn) {
    const { childNodes } = domTree;
    if (!childNodes) {
      return;
    }

    const iterateChildNodes = async nodeChilds => {
      for (const node of nodeChilds) {
        if (node && node.tagName.toUpperCase() === 'IFRAME') {
          await fn(node);
        } else {
          if (node && node.tagName.toUpperCase() === 'HTML') {
            await this._getFrameBundledCss(node);
          }

          if (node.childNodes) {
            await iterateChildNodes(node.childNodes);
          }
        }
      }
    };

    await iterateChildNodes(childNodes);
  }

  /**
   * @param node
   * @return {Promise<void>}
   * @private
   */
  async _getFrameBundledCss(node) {
    const currentUrl = await this._driver.getCurrentUrl();

    if (!GeneralUtils.isAbsoluteUrl(currentUrl)) {
      this._logger.verbose('WARNING! Base URL is not an absolute URL!');
    }

    const timeStart = PerformanceUtils.start();
    const result = await this._driver.executeScript(DomCapture.CAPTURE_CSSOM_SCRIPT);
    this._logger.verbose(`executing javascript to capture css took ${timeStart.end().summary}`);

    const promise = this._processFrameBundledCss(currentUrl, node, result);
    this._frameBundledCssPromises.push(promise);
  }

  /**
   * @param {string} currentUrl
   * @param node
   * @param result
   * @return {Promise<void>}
   * @private
   */
  async _processFrameBundledCss(currentUrl, node, result) {
    let sb = '';
    for (const item of result) {
      let timeStart = PerformanceUtils.start();
      const kind = item.substring(0, 5);
      const value = item.substring(5);
      this._logger.verbose(`splitting css result item took ${timeStart.end().summary}`);
      let css;
      if (kind === 'text:') {
        css = await this._parseAndSerializeCss(currentUrl, value);
      } else {
        css = await this._downloadCss(currentUrl, value);
      }
      css = await this._parseAndSerializeCss(currentUrl, css);
      timeStart = PerformanceUtils.start();
      sb += css;
      this._logger.verbose(`appending CSS to StringBuilder took ${timeStart.end().summary}`);
    }

    node.css = sb;
  }

  /**
   * @param {string} baseUri
   * @param {string} css
   * @return {Promise<string>}
   * @private
   */
  async _parseAndSerializeCss(baseUri, css) {
    const timeStart = PerformanceUtils.start();
    let stylesheet;
    try {
      const parser = new shadyCss.Parser();
      stylesheet = parser.parse(css);
    } catch (ignored) {
      return '';
    }
    this._logger.verbose(`parsing CSS string took ${timeStart.end().summary}`);

    css = await this._serializeCss(baseUri, stylesheet);
    return css;
  }

  /**
   * @param {string} baseUri
   * @param {object} stylesheet
   * @return {Promise<string>}
   * @private
   */
  async _serializeCss(baseUri, stylesheet) {
    const timeStart = PerformanceUtils.start();
    let sb = '';

    let css;
    for (const ruleSet of stylesheet.rules) {
      let addAsIs = true;
      if (ruleSet.name === 'import') {
        this._logger.verbose('encountered @import rule');
        const href = cssUrlParser(ruleSet.parameters);
        css = await this._downloadCss(baseUri, href[0]);
        css = css.trim();
        this._logger.verbose(`imported CSS (whitespaces trimmed) length: ${css.length}`);
        addAsIs = css.length === 0;
        if (!addAsIs) {
          css = await this._parseAndSerializeCss(baseUri, css);
          sb += css;
        }
      }

      if (addAsIs) {
        const stringifier = new shadyCss.Stringifier();
        sb += stringifier.stringify(ruleSet);
      }
    }

    this._logger.verbose(`serializing CSS to StringBuilder took ${timeStart.end().summary}`);
    return sb.toString();
  }

  /**
   * @param {string} baseUri
   * @param {string} value
   * @param {number} [retriesCount=1]
   * @return {Promise<string>}
   * @private
   */
  async _downloadCss(baseUri, value, retriesCount = 1) {
    try {
      this._logger.verbose(`Given URL to download: ${value}`);
      // let href = cssParser.parse(value);
      let href = value;
      if (!GeneralUtils.isAbsoluteUrl(href)) {
        href = url.resolve(baseUri, href.toString());
      }

      const timeStart = PerformanceUtils.start();
      const response = await axios(href);
      const css = response.data;
      this._logger.verbose(`downloading CSS in length of ${css.length} chars took ${timeStart.end().summary}`);
      return css;
    } catch (ex) {
      this._logger.verbose(ex.toString());
      if (retriesCount > 0) {
        retriesCount -= 1;
        return this._downloadCss(baseUri, value, retriesCount);
      }
      return '';
    }
  }
}

exports.DomCapture = DomCapture;
