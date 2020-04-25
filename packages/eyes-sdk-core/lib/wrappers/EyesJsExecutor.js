'use strict'
/* eslint-disable no-unused-vars */

/**
 * An interface for JsExecutors
 * @interface
 */
class EyesJsExecutor {
  /**
   * Schedules a command to execute JavaScript in the context of the currently selected frame or window. The script
   * fragment will be executed as the body of an anonymous function. If the script is provided as a function object,
   * that function will be converted to a string for injection into the target window.
   *
   * @param {!(string|Function)} script - script to execute
   * @param {...*} varArgs - arguments to pass to the script
   * @return {Promise<*>} promise that will resolve to the scripts return value
   */
  executeScript(script, ...varArgs) {
    throw new TypeError('The method is not implemented!')
  }

  /**
   * Schedules a command to make the driver sleep for the given amount of time
   *
   * @param {number} ms - amount of time, in milliseconds, to sleep
   * @return {Promise<void>} A promise that will be resolved when the sleep has finished
   */
  sleep(ms) {
    throw new TypeError('The method is not implemented!')
  }
}

module.exports = EyesJsExecutor
