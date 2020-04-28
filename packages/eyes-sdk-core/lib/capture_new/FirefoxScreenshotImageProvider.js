'use strict'

const {MutableImage, Region} = require('@applitools/eyes-common')
const {ImageProvider} = require('../capture/ImageProvider')
const EyesScreenshot = require('./EyesScreenshot')

/**
 * This class is needed because in certain versions of firefox, a frame screenshot only brings the frame viewport.
 * To solve this issue, we create an image with the full size of the browser viewport and place the frame image
 * on it in the appropriate place.
 */
class FirefoxScreenshotImageProvider extends ImageProvider {
  /**
   * @param {Logger} logger
   * @param {EyesWrappedDriver} driver
   * @param {Eyes} eyes
   */
  constructor(logger, driver, eyes) {
    super()

    this._logger = logger
    this._driver = driver
    this._eyes = eyes
  }

  /**
   * @override
   * @return {Promise<MutableImage>}
   */
  async getImage() {
    this._logger.verbose('Getting screenshot as base64...')
    const screenshot64 = await this._driver.controller.takeScreenshot()
    this._logger.verbose('Done getting base64! Creating BufferedImage...')

    const image = new MutableImage(screenshot64)
    await this._eyes.getDebugScreenshotsProvider().save(image, 'FIREFOX_FRAME')

    const frameChain = this._driver.context.frameChain
    if (frameChain.size > 0) {
      const screenshotType = await EyesScreenshot.getScreenshotType(image, this._eyes)
      let location = this._frameChain.getCurrentFrameLocationInViewport()
      if (screenshotType === EyesScreenshot.ScreenshotType.ENTIRE_FRAME) {
        location = location.offsetByLocation(frameChain.getTopFrameScrollLocation())
      }
      const viewportSize = await this._eyes.getViewportSize()
      const scaleRatio = this._eyes.getDevicePixelRatio()
      return image.crop(new Region(location.scale(scaleRatio), viewportSize.scale(scaleRatio)))
    }

    return image
  }
}

module.exports = FirefoxScreenshotImageProvider
