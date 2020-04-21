'use strict'

const {MutableImage} = require('@applitools/eyes-common')
const {ImageProvider} = require('../capture/ImageProvider')

/**
 * An image provider based on WebDriver's interface.
 */
class TakesScreenshotImageProvider extends ImageProvider {
  /**
   * @param {Logger} logger A Logger instance.
   * @param {EyesWrappedDriver} driver
   */
  constructor(logger, driver) {
    super()

    this._logger = logger
    this._driver = driver
  }

  /**
   * @override
   * @return {Promise<MutableImage>}
   */
  async getImage() {
    this._logger.verbose('Getting screenshot as base64...')
    const screenshot64 = await this._driver.controller.takeScreenshot()
    this._logger.verbose('Done getting base64! Creating MutableImage...')
    return new MutableImage(screenshot64)
  }
}

module.exports = TakesScreenshotImageProvider
