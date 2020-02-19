'use strict'

const {EyesRunner} = require('./EyesRunner')

class VisualGridRunner extends EyesRunner {
  /**
   * @param {number} [concurrentSessions]
   */
  constructor(concurrentSessions) {
    super()
    this._concurrentSessions = concurrentSessions
  }

  /**
   * @return {number}
   */
  getConcurrentSessions() {
    return this._concurrentSessions
  }
}

exports.VisualGridRunner = VisualGridRunner
