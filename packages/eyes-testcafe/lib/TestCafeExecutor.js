'use strict'

const {ClientFunction} = require('testcafe')
const {EyesJsExecutor} = require('@applitools/eyes-sdk-core')
const {TypeUtils, ArgumentGuard} = require('@applitools/eyes-common')
const isTestcafeSelector = require('./isTestcafeSelector')
const makeSafeExecuteFunction = require('./safeExecuteFunction')

/**
 * @ignore
 */
class TestCafeExecutor extends EyesJsExecutor {
  /**
   * @param {EyesWebDriver|WebDriver} driver
   */
  constructor(driver) {
    super()
    this._driver = driver
    this._safeExecuteFunction = makeSafeExecuteFunction(driver)
    this._clientFuncions = {}
  }

  /**
   * @inheritDoc
   */
  executeScript(script, ...args) {
    // Assuming script has name (for dom capture caching)
    if (!TypeUtils.isString(script)) {
      return this.executeClientFunction({script, scriptName: script.name})
    }

    const dependencies = {}
    for (let i = 0; i < args.length; i++) {
      dependencies[`arg${i}`] = args[i]
    }

    const mapSelector =
      args.length === 1 && isTestcafeSelector(args[0])
        ? 'arguments[0] = arguments[0] && arguments[0]()'
        : 'void(0)'
    const func = new Function(
      `return (function() {${mapSelector}; ${script}})(${Object.keys(dependencies).join(',')})`,
    )
    return this._driver.eval(func, {dependencies})
  }

  async executeFunction(func) {
    return this._safeExecuteFunction(func)
  }

  async executeClientFunction({script, scriptName, args = {}}) {
    ArgumentGuard.notNullOrEmpty(scriptName, 'scriptName')
    ArgumentGuard.notNullOrEmpty(script, 'script')

    if (!this._clientFuncions[scriptName]) {
      this._clientFuncions[scriptName] = ClientFunction(script).with({boundTestRun: this._driver})
    }
    const execute = this._clientFuncions[scriptName].with({
      dependencies: args,
    })
    return execute()
  }

  /**
   * @inheritDoc
   */
  sleep(_millis) {
    throw new Error('sleep not implemented in test cafe')
  }
}

exports.TestCafeExecutor = TestCafeExecutor
