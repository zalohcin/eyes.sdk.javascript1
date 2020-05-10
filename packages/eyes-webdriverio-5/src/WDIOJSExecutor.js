'use strict'

const {EyesJsExecutor} = require('@applitools/eyes-sdk-core')
const WDIOWrappedElement = require('./WDIOWrappedElement')

class WDIOJsExecutor extends EyesJsExecutor {
  constructor(logger, driver) {
    super()
    this._logger = logger
    this._driver = driver
  }

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

  sleep(ms) {
    return this._driver.pause(ms)
  }
}

module.exports = WDIOJsExecutor
