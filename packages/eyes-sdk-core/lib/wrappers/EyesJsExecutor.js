'use strict'
const EyesWrappedElement = require('./EyesWrappedElement')

/**
 * @typedef {import('../logging/Logger')} Logger
 */

/**
 * @template Driver, Element, Selector
 * @typedef {import('./EyesWrappedDriver')<Driver, Element, Selector>} EyesWrappedDriver
 */

/**
 * The object which implements the lowest-level functions to work with element finder
 * @template Driver, Element, Selector
 * @typedef SpecJsExecutor
 * @prop {(driver: Driver, script: string|Function, ...args) => Promise<*>} executeScript - execute script and return result
 * @prop {(driver: Driver, ms: number) => Promise<void>} sleep - makes the driver sleep for the given amount of time in ms
 */

/**
 * @template Driver - Driver provided by wrapped framework
 * @template Element - Element provided by wrapped framework
 * @template Selector - Selector supported by framework
 */
class EyesJsExecutor {
  /**
   * @template Driver, Element, Selector
   * @param {SpecJsExecutor<Driver, Element, Selector>} spec - specifications for the specific framework
   * @return {typeof EyesJsExecutor} specialized version of this class
   */
  static specialize(spec) {
    return class extends EyesJsExecutor {
      /** @override */
      static get spec() {
        return spec
      }
      /** @override */
      get spec() {
        return spec
      }
    }
  }
  /**
   * @type {SpecsJsExecutor}
   */
  static get spec() {
    throw new TypeError('The class is not specialized')
  }
  /** @type {SpecsJsExecutor<Driver, Element, Selector>} */
  get spec() {
    throw new TypeError('The class is not specialized')
  }
  /**
   * Construct js executor instance
   * @param {Logger} logger - logger instance
   * @param {EyesWrappedDriver<Driver, Element, Selector>} driver - wrapped driver instance
   */
  constructor(logger, driver) {
    this._logger = logger
    this._driver = driver
  }
  /**
   * Schedules a command to execute JavaScript in the context of the currently selected frame or window. The script
   * fragment will be executed as the body of an anonymous function. If the script is provided as a function object,
   * that function will be converted to a string for injection into the target window.
   *
   * @param {!(string|Function)} script - script to execute
   * @param {...*} args - arguments to pass to the script
   * @return {Promise<*>} promise that will resolve to the scripts return value
   */
  async executeScript(script, ...args) {
    try {
      const result = await this.spec.executeScript(
        this._driver.unwrapped,
        script,
        ...args.map(arg => (arg instanceof EyesWrappedElement ? arg.unwrapped : arg)),
      )
      this._logger.verbose('Done!')
      return result
    } catch (err) {
      this._logger.verbose('WARNING: execute script error: ' + err)
      throw err
    }
  }
  /**
   * Schedules a command to make the driver sleep for the given amount of time
   * @param {number} ms - amount of time, in milliseconds, to sleep
   * @return {Promise<void>} promise that will be resolved when the sleep has finished
   */
  async sleep(ms) {
    return this.spec.pause(this._driver.unwrapped, ms)
  }
}

module.exports = EyesJsExecutor
