'use strict'

const {BrowserNames} = require('@applitools/eyes-common')

const TakesScreenshotImageProvider = require('./TakesScreenshotImageProvider')
const FirefoxScreenshotImageProvider = require('./FirefoxScreenshotImageProvider')
const SafariScreenshotImageProvider = require('./SafariScreenshotImageProvider')

class ImageProviderFactory {
  /**
   * @param {Logger} logger
   * @param {EyesWrappedDriver} driver
   * @param {Eyes} eyes
   * @param {UserAgent} userAgent
   * @return {ImageProvider}
   */
  static getImageProvider(logger, driver, eyes, userAgent) {
    if (userAgent) {
      if (userAgent.getBrowser() === BrowserNames.Firefox) {
        try {
          if (Number.parseInt(userAgent.getBrowserMajorVersion(), 10) >= 48) {
            return new FirefoxScreenshotImageProvider(logger, driver, eyes)
          }
        } catch (ignored) {
          return new TakesScreenshotImageProvider(logger, driver)
        }
      } else if (userAgent.getBrowser() === BrowserNames.Safari) {
        return new SafariScreenshotImageProvider(logger, driver, eyes, userAgent)
      }
    }
    return new TakesScreenshotImageProvider(logger, driver)
  }
}

module.exports = ImageProviderFactory
