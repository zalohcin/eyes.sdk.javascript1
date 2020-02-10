'use strict'

/**
 * @interface
 */
class ImageOrientationHandler {
  /**
   * @param {WebDriver} driver
   * @return {Promise.<Boolean>}
   */
  // eslint-disable-next-line
  isLandscapeOrientation(driver) {}

  /**
   * @param {Logger} logger
   * @param {WebDriver} driver
   * @param {MutableImage} image
   * @return {Promise.<Boolean>}
   */
  // eslint-disable-next-line
  tryAutomaticRotation(logger, driver, image) {}
}

module.exports = ImageOrientationHandler
