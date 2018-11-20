'use strict';

const { Location } = require('@applitools/eyes-sdk-core');
const { getCaptureDomScript } = require('@applitools/dom-capture');

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

    const dom = await DomCapture.getWindowDom(logger, driver);

    if (positionProvider) {
      await positionProvider.restoreState(originalPosition);
    }

    return JSON.stringify(dom);
  }

  /**
   * @param {Logger} logger A Logger instance.
   * @param {EyesWebDriver} driver
   * @return {Promise<object>}
   */
  static async getWindowDom(logger, driver) {
    const captureDomScript = await getCaptureDomScript();

    let wrappedScript = `var callback = arguments[arguments.length - 1];
        ${captureDomScript}.then(res => {
        return callback(res)
      })`;
    const domSnapshot = await driver.executeAsyncScript(wrappedScript);
    return JSON.parse(domSnapshot);
  }
}

exports.DomCapture = DomCapture;
