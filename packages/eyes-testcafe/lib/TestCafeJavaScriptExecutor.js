'use strict';

const { EyesJsExecutor } = require('@applitools/eyes-sdk-core');

/**
 * @ignore
 */
class TestCafeJavaScriptExecutor extends EyesJsExecutor {
  /**
   * @param {EyesWebDriver|WebDriver} driver
   */
  constructor(driver) {
    super();

    this._driver = driver;
  }

  /**
   * @inheritDoc
   */
  executeScript(script, ...args) {
    const dependencies = {};
    for (let i = 0; i < args.length; i++) { // eslint-disable-line no-plusplus
      dependencies[`arg${i}`] = args[i];
    }
    const func = new Function(`return (function() {${script}})(${Object.keys(dependencies).join(',')})`); // eslint-disable-line no-new-func
    return this._driver.eval(func, { dependencies });
  }

  /**
   * @inheritDoc
   */
  sleep(millis) {
    throw new Error('sleep not implemented in test cafe');
  }
}

exports.TestCafeJavaScriptExecutor = TestCafeJavaScriptExecutor;
