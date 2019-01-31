'use strict';

const { Location, GeneralUtils, PerformanceUtils } = require('@applitools/eyes-sdk-core');
const { getCaptureDomScript } = require('@applitools/dom-capture');
const axios = require('axios');

class DomCapture {

  /**
   * @param {Logger} logger
   * @param {EyesWebDriver|WebDriver} driver
   */
  constructor(logger, driver) {
    this._logger = logger;
    this._driver = driver;
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

    const domCapture = new DomCapture(logger, driver);
    const dom = await domCapture.getWindowDom();

    if (positionProvider) {
      await positionProvider.restoreState(originalPosition);
    }

    return JSON.stringify(dom);
  }

  /**
   * @return {Promise<object>}
   */
  async getWindowDom() {
    const captureDomScript = await getCaptureDomScript();

    let asyncCaptureDomScript =
      `var callback = arguments[arguments.length - 1];
        ${captureDomScript}.then(res => {
        return callback(res)
      })`;
    const url = await this.driver.getCurrentUrl();

    let domSnapshot = await this.getFrameDom(asyncCaptureDomScript, url);

    return JSON.parse(domSnapshot);
  }

  async getFrameDom(script, url) {

    let domSnapshot = await this.driver.executeAsyncScript(script);

    const cssIndex = domSnapshot.indexOf('#####');
    const iframeIndex = domSnapshot.indexOf('@@@@@');
    const separatorIndex = domSnapshot.indexOf('-----');

    let cssArr = [];
    if (cssIndex !== -1 && cssIndex < separatorIndex) {
      const cssSeparatorIndex = iframeIndex !== -1 && separatorIndex !== -1 ? Math.min(iframeIndex, separatorIndex) : Math.max(iframeIndex, separatorIndex);
      const cssText = domSnapshot.substring(cssIndex + 6, cssSeparatorIndex);
      cssArr = cssText.split('\n');
    }

    for (const cssHref of cssArr) {
      if (!cssHref) {
        continue;
      }
      const css = await this._downloadCss(url, cssHref);
      domSnapshot = domSnapshot.replace(`#####${cssHref}#####`, css);
    }

    let iframeArr = [];
    if (iframeIndex !== -1 && iframeIndex < separatorIndex) {
      const iframesText = domSnapshot.substring(iframeIndex + 6, separatorIndex);
      iframeArr = iframesText.split('\n');
    }

    if (cssIndex < separatorIndex && iframeIndex < separatorIndex && (cssIndex !== -1 || iframeIndex !== -1) && separatorIndex !== -1) {
      domSnapshot = domSnapshot.substring(separatorIndex + 6);
    }

    for (const iframeXpath of iframeArr) {
      if (!iframeXpath) {
        continue;
      }
      const iframeEl = await this.driver.findElementByXPath(iframeXpath);
      await this._driver.switchTo().frame(iframeEl);
      let domIFrame;
      try {
        domIFrame = await this.getFrameDom(script);
      } catch (e) {
        domIFrame = {};
      }
      await this._driver.switchTo().parentFrame();
      domSnapshot = domSnapshot.replace(`"@@@@@${iframeXpath}@@@@@"`, domIFrame);
    }

    return domSnapshot;
  }

  /**
   * @param {string} baseUri
   * @param {string} href
   * @param {number} [retriesCount=1]
   * @return {Promise<string>}
   * @private
   */
  async _downloadCss(baseUri, href, retriesCount = 1) {
    try {
      this._logger.verbose(`Given URL to download: ${href}`);
      if (!GeneralUtils.isAbsoluteUrl(href)) {
        href = url.resolve(baseUri, href.toString());
      }

      const timeStart = PerformanceUtils.start();
      const response = await axios(downloadUrl);
      const css = response.data;
      this._logger.verbose(`downloading CSS in length of ${css.length} chars took ${timeStart.end().summary}`);
      return css;
    } catch (ex) {
      this._logger.verbose(ex.toString());
      retriesCount -= 1;
      if (retriesCount > 0) {
        return this._downloadCss(baseUri, href, retriesCount);
      }
      return '';
    }
  }

  get driver() {
    return this._driver;
  }
}

exports.DomCapture = DomCapture;
