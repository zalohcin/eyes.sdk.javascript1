'use strict';

const { CheckRGSettings } = require('./CheckRGSettings');

class Target {
  /**
   * @return {CheckRGSettings}
   */
  static window() {
    return new CheckRGSettings();
  }

  /**
   * @param {Region} region
   * @return {CheckRGSettings}
   */
  static region(region) {
    return new CheckRGSettings(region, undefined);
  }

  /**
   * @param {string} selector
   * @return {CheckRGSettings}
   */
  static selector(selector) {
    return new CheckRGSettings(undefined, selector);
  }
}

exports.Target = Target;
