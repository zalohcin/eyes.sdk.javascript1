'use strict';

const { CheckRGSettings } = require('./CheckRGSettings');

class Target {
  /**
   * Validate current window
   *
   * @return {CheckRGSettings}
   * @constructor
   */
  static window() {
    return new CheckRGSettings();
  }

  /**
   * Validate region (in current window or frame) using region's rect, element or element's locator
   *
   * @param {Region|RegionObject|By|WebElement|EyesWebElement|string} region The region to validate.
   * @param {number|string|By|WebElement|EyesWebElement} [frame] The element which is the frame to switch to.
   * @return {CheckRGSettings}
   * @constructor
   */
  static region(region, frame) {
    return new CheckRGSettings(region, frame);
  }

  /**
   * Validate frame
   *
   * @param {number|string|By|WebElement|EyesWebElement} frame The element which is the frame to switch to.
   * @return {SeleniumCheckSettings}
   * @constructor
   */
  static frame(frame) {
    return new CheckRGSettings(null, frame);
  }
}

exports.Target = Target;
