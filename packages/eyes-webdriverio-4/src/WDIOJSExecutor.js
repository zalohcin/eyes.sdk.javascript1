'use strict'

const {EyesJsExecutor} = require('@applitools/eyes-sdk-core')

class WDIOJSExecutor extends EyesJsExecutor {
  /**
   * @param {EyesWebDriver} driver
   */
  constructor(driver) {
    super()

    /** @type {EyesWebDriver} */
    this._driver = driver
  }

  /**
   * @override
   * @inheritDoc
   */
  async executeScript(script, ...varArgs) {
    try {
      const result = await this._driver.execute(script, ...varArgs)
      this._driver._logger.verbose('Done!')
      return result
    } catch (e) {
      this._driver._logger.verbose(
        `Error executeScript: ${script}\nargs: ${JSON.stringify(varArgs)}`,
      )
      throw e
    }
  }

  /** @override */
  async executeAsyncScript(script, ...varArgs) {
    try {
      const result = await this._driver.executeAsync(script, ...varArgs)
      this._driver._logger.verbose('Done!')
      return result
    } catch (e) {
      this._driver._logger.verbose('WARNING: execute script error: ' + e)
      throw e
    }
  }

  /**
   * @override
   * @inheritDoc
   */
  sleep(millis) {
    return this._driver.remoteWebDriver.pause(millis)
  }
}

module.exports = WDIOJSExecutor
