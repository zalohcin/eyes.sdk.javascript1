'use strict';

const { EyesScreenshotFactory } = require('@applitools/eyes.sdk.core');

const { EyesWebDriverScreenshot } = require('./EyesWebDriverScreenshot');

/**
 * Encapsulates the instantiation of an {@link EyesWebDriverScreenshot} .
 */
class EyesWebDriverScreenshotFactory extends EyesScreenshotFactory {
  /**
   * @param {Logger} logger
   * @param {EyesWebDriver} driver
   * @param {PromiseFactory} promiseFactory
   */
  constructor(logger, driver, promiseFactory) {
    super();

    this._logger = logger;
    this._driver = driver;
    this._promiseFactory = promiseFactory;
  }

  /**
   * @override
   * @inheritDoc
   */
  makeScreenshot(image) {
    const result = new EyesWebDriverScreenshot(this._logger, this._driver, image, this._promiseFactory);
    return result.init();
  }
}

exports.EyesWebDriverScreenshotFactory = EyesWebDriverScreenshotFactory;
