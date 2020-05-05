'use strict'

const {EyesJsExecutor} = require('@applitools/eyes-sdk-core')
const WDIOWrappedElement = require('./WDIOWrappedElement')

class WDIOJsExecutor extends EyesJsExecutor {
  /**
   * @param {WDIODriver} driver
   */
  constructor(logger, driver) {
    super()
    this._logger = logger
    /** @type {WDIODriver} */
    this._driver = driver
  }

  /**
   * @override
   * @inheritDoc
   */
  async executeScript(script, ...args) {
    try {
      const {value} = await this._driver.execute(
        script,
        ...args.map(arg => (arg instanceof WDIOWrappedElement ? arg.unwrapped : arg)),
      )
      this._logger.verbose('Done!')
      return value
    } catch (err) {
      this._logger.verbose('WARNING: execute script error: ' + err)
      throw err
    }
  }

  /** @override */
  async executeAsyncScript(script, ...args) {
    try {
      const value = await this._driver.executeAsync(
        script,
        ...args.map(arg => (arg instanceof WDIOWrappedElement ? arg.unwrapped : arg)),
      )
      this._logger.verbose('Done!')
      return value
    } catch (err) {
      this._logger.verbose('WARNING: execute script error: ' + err)
      throw err
    }
  }

  /**
   * @override
   * @inheritDoc
   */
  sleep(millis) {
    return this._driver.pause(millis)
  }
}

module.exports = WDIOJsExecutor
