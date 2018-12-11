'use strict';

/**
 * @interface
 */
class ImageOrientationHandler {
  /**
   * @param {IWebDriver} driver
   * @return {Promise<boolean>}
   */
  isLandscapeOrientation(driver) {}

  /**
   * @param {Logger} logger
   * @param {IWebDriver} driver
   * @param {MutableImage} image
   * @return {Promise<boolean>}
   */
  tryAutomaticRotation(logger, driver, image) {}
}

exports.ImageOrientationHandler = ImageOrientationHandler;
