'use strict'

const {TestcafeCheckSettings} = require('./TestcafeCheckSettings')

class Target {
  /**
   * Validate current window
   *
   * @return {TestcafeCheckSettings}
   * @constructor
   */
  static window() {
    return new TestcafeCheckSettings()
  }
}

exports.Target = Target
