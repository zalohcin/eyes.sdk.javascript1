'use strict'

const {EyesJsExecutor} = require('@applitools/eyes-sdk-core')
const {TypeUtils} = require('@applitools/eyes-common')
const {makeClientFunctionWrapper} = require('./makeClientFunctionWrapper')
const isTestcafeSelector = require('./isTestcafeSelector')

/**
 * @ignore
 */
class TestCafeJavaScriptExecutor extends EyesJsExecutor {
  /**
   * @param {EyesWebDriver|WebDriver} driver
   */
  constructor(driver) {
    super()

    this._driver = driver
    this._clientFunctionWrapper = makeClientFunctionWrapper({logger: {log: () => {}}})
  }

  /**
   * @inheritDoc
   */
  executeScript(script, ...args) {
    if (!TypeUtils.isString(script)) {
      return this.executeFunction(script)
    }

    const dependencies = {}
    for (let i = 0; i < args.length; i++) {
      // eslint-disable-line no-plusplus
      dependencies[`arg${i}`] = args[i]
    }

    const mapSelector =
      args.length === 1 && isTestcafeSelector(args[0])
        ? 'arguments[0] = arguments[0] && arguments[0]()'
        : 'void(0)'
    const func = new Function(
      `return (function() {${mapSelector}; ${script}})(${Object.keys(dependencies).join(',')})`,
    ) // eslint-disable-line no-new-func
    return this._driver.eval(func, {dependencies})
  }

  /*
   * Note: func must return a Promise (also can't async).
   */
  async executeFunction(func) {
    const wrappedFunc = await this._clientFunctionWrapper(func)
    return wrappedFunc(this._driver)
  }

  /**
   * @inheritDoc
   */
  sleep(millis) {
    throw new Error('sleep not implemented in test cafe')
  }
}

exports.TestCafeJavaScriptExecutor = TestCafeJavaScriptExecutor
