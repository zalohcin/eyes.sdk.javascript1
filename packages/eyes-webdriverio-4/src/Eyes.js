'use strict'

const {EyesRunner, ClassicRunner, VisualGridRunner} = require('@applitools/eyes-sdk-core')

const {EyesWDIO} = require('./EyesWDIO')
const {EyesVisualGrid} = require('./EyesVisualGrid')

/**
 * @abstract
 * @extends EyesVisualGrid
 * @extends EyesWDIO
 */
class Eyes {
  /**
   * Creates a new (possibly disabled) Eyes instance that interacts with the Eyes Server at the specified url.
   *
   * @param {string|boolean|VisualGridRunner} [serverUrl=EyesBase.getDefaultServerUrl()] The Eyes server URL.
   * @param {boolean} [isDisabled=false] Set to true to disable Applitools Eyes and use the webdriver directly.
   * @param {EyesRunner} [runner]
   * @return {EyesWDIO|EyesVisualGrid}
   */
  constructor(serverUrl, isDisabled, runner = new ClassicRunner()) {
    if (serverUrl instanceof EyesRunner) {
      runner = serverUrl
      serverUrl = undefined
    }

    if (runner && runner instanceof VisualGridRunner) {
      return new EyesVisualGrid(serverUrl, isDisabled, runner)
    }

    return new EyesWDIO(serverUrl, isDisabled, runner)
  }
}

exports.Eyes = Eyes
