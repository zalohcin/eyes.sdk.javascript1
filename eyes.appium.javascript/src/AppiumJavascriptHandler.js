'use strict';

const { MouseTrigger } = require('@applitools/eyes.sdk.core');
const { JavascriptHandler } = require('@applitools/eyes.selenium');
const AppiumJsCommandExtractor = require('./AppiumJsCommandExtractor');

class AppiumJavascriptHandler extends JavascriptHandler {
  /**
   * @param {EyesWebDriver} driver
   * @param {PromiseFactory} promiseFactory
   */
  constructor(driver, promiseFactory) {
    super(promiseFactory);

    this._driver = driver;
  }

  /**
   * @override
   * @param {!String} script
   * @param {Object...} args
   * @return {Promise.<void>}
   */
  handle(script, ...args) {
    // Appium commands are sometimes sent as Javascript
    if (AppiumJsCommandExtractor.isAppiumJsCommand(script)) {
      const that = this;
      return that._driver.manage().window().getSize()
        .then(windowSize => AppiumJsCommandExtractor.extractTrigger(that._driver.getElementIds(), windowSize, that._promiseFactory, script, args))
        .then(trigger => {
          if (trigger) {
            // TODO - Daniel, additional type of triggers
            if (trigger instanceof MouseTrigger) {
              that._driver.getEyes()
                .addMouseTrigger(trigger.getMouseAction(), trigger.getControl(), trigger.getLocation());
            }
          }
        });
    }

    return this._promiseFactory.resolve();
  }
}

module.exports = AppiumJavascriptHandler;
