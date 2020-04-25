'use strict'
/* eslint-disable no-unused-vars */

/**
 * @typedef {import('@applitools/eyes-common').Location} Location
 * @typedef {import('@applitools/eyes-common').RectangleSize} RectangleSize
 * @typedef {import('@applitools/eyes-common').Region} Region
 */

/**
 * An interface for driver controller
 * @interface
 */
class EyesDriverController {
  /**
   * Get window size and location
   * @param {string} [handle] - window handle, if not specified use current window
   * @return {Promise<Region>} windows size and location
   */
  async getWindowRect(handle) {
    throw new TypeError('The method is not implemented!')
  }

  /**
   * Set window size and location
   * @param {Region} rect - required windows size and location
   * @param {string} [handle] - window handle, if not specified use current window
   * @returns {Promise<void>}
   */
  async setWindowRect(rect, handle) {
    throw new TypeError('The method is not implemented!')
  }

  /**
   * Get window location
   * @param {string} [handle] - window handle, if not specified use current window
   * @return {Promise<Location>} windows location
   */
  async getWindowLocation(handle) {
    throw new TypeError('The method is not implemented!')
  }

  /**
   * Set window location
   * @param {Location} location - required  windows location
   * @param {string} [handle] - window handle, if not specified use current window
   * @returns {Promise<void>}
   */
  async setWindowLocation(location, handle) {
    throw new TypeError('The method is not implemented!')
  }

  /**
   * Get window size
   * @param {string} [handle] - window handle, if not specified use current window
   * @return {Promise<Region>} windows size
   */
  async getWindowSize(handle) {
    throw new TypeError('The method is not implemented!')
  }

  /**
   * Set window size
   * @param {RectangleSize} rect - required windows size
   * @param {string} [handle] - window handle, if not specified use current window
   * @returns {Promise<void>}
   */
  async setWindowSize(size, handle) {
    throw new TypeError('The method is not implemented!')
  }

  /**
   * Take screenshot of the current viewport
   * @return {Promise<Buffer>} image of screenshot
   */
  async takeScreenshot() {
    throw new TypeError('The method is not implemented!')
  }

  /**
   * Check if running in landscape orientation
   * @return {Promise<boolean>} true if landscape orientation detected, false otherwise
   */
  async isLandscapeOrientation() {
    throw new TypeError('The method is not implemented!')
  }

  /**
   * Check if running in mobile device
   * @return {Promise<boolean>} true if mobile, false otherwise
   */
  async isMobileDevice() {
    throw new TypeError('The method is not implemented!')
  }

  /**
   * Get mobile OS if detected
   * @return {Promise<?string>} mobile OS if detected, null otherwise
   */
  async getMobileOS() {
    throw new TypeError('The method is not implemented!')
  }

  /**
   * Get AUT session ID
   * @return {Promise<string>} AUT session ID
   */
  async getAUTSessionId() {
    throw new TypeError('The method is not implemented!')
  }

  /**
   * Get user agent
   * @return {Promise<string>} user agent
   */
  async getUserAgent() {
    throw new TypeError('The method is not implemented!')
  }

  /**
   * Get current page title
   * @return {Promise<string>} current page title
   */
  async getTitle() {
    throw new TypeError('The method is not implemented!')
  }

  /**
   * Get current page url
   * @return {Promise<string>} current page url
   */
  async getSource() {
    throw new TypeError('The method is not implemented!')
  }
}

module.exports = EyesDriverController
