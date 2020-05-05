'use strict'

const {EyesRunner} = require('./runner/EyesRunner')
const {ClassicRunner} = require('./runner/ClassicRunner')
const {VisualGridRunner} = require('./runner/VisualGridRunner')

class EyesFactory {
  static specialize({EyesClassic, EyesVisualGrid}) {
    return class extends EyesFactory {
      static get EyesClassic() {
        return EyesClassic
      }
      static get EyesVisualGrid() {
        return EyesVisualGrid
      }
    }
  }
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
      return new this.constructor.EyesVisualGrid(serverUrl, isDisabled, runner)
    }

    return new this.constructor.EyesClassic(serverUrl, isDisabled, runner)
  }
}

module.exports = EyesFactory
