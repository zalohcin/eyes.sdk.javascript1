'use strict';

const { EyesSelenium } = require('@applitools/eyes-selenium');

const { ElementFinderWrapper, ElementArrayFinderWrapper } = require('./ElementFinderWrappers');
const VERSION = require('../package.json').version;

/**
 * The main type - to be used by the users of the library to access all functionality.
 */
class Eyes extends EyesSelenium {
  // noinspection JSMethodCanBeStatic
  /**
   * @inheritDoc
   */
  getBaseAgentId() {
    return `eyes.selenium.protractor.javascript/${VERSION}`;
  }

  /**
   * @inheritDoc
   */
  open(driver, appName, testName, viewportSize, sessionType) {
    if (typeof protractor === 'undefined') {
      throw new Error('Protractor component not found.');
    }

    // extend protractor element to return ours
    if (!global.isEyesOverrodeProtractor) {
      const originalBy = global.by;
      const originalElement = global.element;

      global.element = locator => new ElementFinderWrapper(this._logger, this._driver, originalElement(locator), locator);
      global.$ = locator => new ElementFinderWrapper(this._logger, this._driver, originalElement(originalBy.css(locator)), originalBy.css(locator));

      global.element.all = locator => new ElementArrayFinderWrapper(this._logger, this._driver, originalElement.all(locator), locator);
      global.$$ = locator => new ElementArrayFinderWrapper(this._logger, this._driver, originalElement.all(originalBy.css(locator)), originalBy.css(locator));

      global.isEyesOverrodeProtractor = true;
    }

    return super.open(driver, appName, testName, viewportSize, sessionType);
  }
}

exports.Eyes = Eyes;
