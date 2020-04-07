'use strict'

const {EyesScreenshotFactory} = require('@applitools/eyes-sdk-core')

const EyesWDIOScreenshot = require('./EyesWDIOScreenshot')

/**
 * Encapsulates the instantiation of an {@link EyesWDIOScreenshot} .
 */
class EyesWDIOScreenshotFactory extends EyesScreenshotFactory {
  /**
   * @param {Logger} logger
   * @param {EyesWDIO} eyes
   */
  constructor(logger, eyes) {
    super()

    this._logger = logger
    this._eyes = eyes
  }

  /**
   * @override
   * @inheritDoc
   */
  makeScreenshot(image) {
    const result = new EyesWDIOScreenshot(this._logger, this._eyes, image)
    return result.init()
  }
}

module.exports = EyesWDIOScreenshotFactory
