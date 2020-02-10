'use strict'

/**
 * @interface
 */
class JavascriptHandler {
  /**
   * @param {!String} script
   * @param {Object...} args
   * @return {Promise.<void>}
   */
  // eslint-disable-next-line
  handle(script, ...args) {
    return null
  }
}

module.exports = JavascriptHandler
