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

  /**
   * Validate region (in current window or frame) using region's rect, element or element's locator
   *
   * @param {Region|RegionObject|By|WebElement|EyesWebElement} region - The region to validate.
   * @param {number|string|By|WebElement|EyesWebElement} [frame] - The element which is the frame to switch to.
   * @return {TestcafeCheckSettings}
   * @constructor
   */
  static region(region, frame) {
    return new TestcafeCheckSettings(region, frame)
  }

  /**
   * Validate frame
   *
   * @param {number|string|By|WebElement|EyesWebElement} frame - The element which is the frame to switch to.
   * @return {TestcafeCheckSettings}
   * @constructor
   */
  static frame(frame) {
    return new TestcafeCheckSettings(null, frame)
  }
}

exports.Target = Target
