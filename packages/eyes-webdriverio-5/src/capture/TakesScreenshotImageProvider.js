'use strict'

const {ImageProvider, MutableImage} = require('@applitools/eyes-sdk-core')
const {isBlankImage} = require('@applitools/bitmap-commons')

/**
 * An image provider based on WebDriver's interface.
 */
class TakesScreenshotImageProvider extends ImageProvider {
  /**
   * @param {Logger} logger A Logger instance.
   * @param {EyesWebDriver} tsInstance
   */
  constructor(logger, tsInstance) {
    super()

    this._logger = logger
    this._tsInstance = tsInstance
  }

  async needsRetry(pngBuffer) {
    const browserName = (await this._tsInstance.getBrowserName()).toLowerCase()
    return (
      browserName.includes('edge') &&
      (await isBlankImage({pngBuffer: Buffer.from(pngBuffer, 'base64'), rgbColor: [0, 0, 0]}))
    )
  }

  /**
   * @override
   * @return {Promise.<MutableImage>}
   */
  async getImage() {
    this._logger.verbose('Getting screenshot as base64...')
    let screenshot64 = await this._tsInstance.remoteWebDriver.takeScreenshot()
    if (await this.needsRetry(screenshot64)) screenshot64 = await this._tsInstance.takeScreenshot()
    this._logger.verbose('Done getting base64! Creating MutableImage...')
    return new MutableImage(screenshot64)
  }
}

module.exports = TakesScreenshotImageProvider
