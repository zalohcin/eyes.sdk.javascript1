'use strict'
/* eslint-disable no-unused-vars */

/**
 * @typedef {import('@applitools/eyes-common').Location} Location
 * @typedef {import('@applitools/eyes-common').RectangleSize} RectangleSize
 * @typedef {import('@applitools/eyes-common').Region} Region
 * @typedef {import('@applitools/eyes-common').MutableImage} MutableImage
 */

/**
 * An interface for driver controller
 * @interface
 */
class EyesDriverController {
  /**
   * Get window location
   * @return {Promise<Location>} windows location
   */
  async getWindowLocation() {
    throw new TypeError('The method is not implemented!')
  }

  /**
   * Set window location
   * @param {Location} location - required  windows location
   * @returns {Promise<void>}
   */
  async setWindowLocation(location) {
    throw new TypeError('The method is not implemented!')
  }

  /**
   * Get window size
   * @return {Promise<RectangleSize>} windows size
   */
  async getWindowSize() {
    throw new TypeError('The method is not implemented!')
  }

  /**
   * Set window size
   * @param {RectangleSize} size - required windows size
   * @returns {Promise<void>}
   */
  async setWindowSize(size) {
    throw new TypeError('The method is not implemented!')
  }

  /**
   * Take screenshot of the current viewport
   * @return {Promise<MutableImage>} image of screenshot
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
