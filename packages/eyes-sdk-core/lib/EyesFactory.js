'use strict'
const Configuration = require('./config/Configuration')
const CorsIframeHandles = require('./capture/CorsIframeHandles')
const EyesRunner = require('./runner/EyesRunner')
const ClassicRunner = require('./runner/ClassicRunner')
const VisualGridRunner = require('./runner/VisualGridRunner')

/**
 * @template Driver, Element, Selector
 * @typedef {import('./EyesClassic')<Driver, Element, Selector>} EyesClassic
 */

/**
 * @template Driver, Element, Selector
 * @typedef {import('./EyesVisualGrid')<Driver, Element, Selector>} EyesVisualGrid
 */

/**
 * This class represents an abstraction for construction of {@link EyesClassic} and {@link EyesVisualGrid}
 *
 * @template Driver
 * @template Element
 * @template Selector
 */
class EyesFactory {
  /**
   * Return a specialized
   * @template Driver, Element, Selector
   * @param {Object} implementations - implementations of related classes
   * @param {EyesClassic<Driver, Element, Selector>} implementations.EyesClassic - specialized implementation of {@link EyesClassic} class
   * @param {EyesVisualGrid<Driver, Element, Selector>} implementations.EyesVisualGrid - specialized implementation of {@link EyesVisualGrid} class
   * @return {typeof EyesFactory} specialized version of {@link EyesFactory}
   */
  static specialize({EyesClassic, EyesVisualGrid}) {
    return class extends EyesFactory {
      /**
       * @return {EyesClassic} specialized implementation of {@link EyesClassic} class
       */
      static get EyesClassic() {
        return EyesClassic
      }
      /**
       * @return {EyesClassic} specialized implementation of {@link EyesVisualGrid} class
       */
      static get EyesVisualGrid() {
        return EyesVisualGrid
      }
    }
  }
  /**
   * Creates a new (possibly disabled) Eyes instance that interacts with the Eyes Server at the specified url.
   * @param {string|boolean|VisualGridRunner} [serverUrl=EyesBase.getDefaultServerUrl()] - Eyes server URL
   * @param {boolean} [isDisabled=false] - set to true to disable Applitools Eyes and use the webdriver directly
   * @param {EyesRunner} [runner=new ClassicRunner()] - runner related to the wanted Eyes implementation
   */
  constructor(serverUrl, isDisabled, runner = new ClassicRunner()) {
    return this.constructor.from(serverUrl, isDisabled, runner)
  }
  /**
   * Creates a new (possibly disabled) Eyes instance that interacts with the Eyes Server at the specified url.
   * @template Driver, Element, Selector
   * @template {EyesRunner} Runner
   * @param {string|boolean|Runner} [serverUrl=EyesBase.getDefaultServerUrl()] - Eyes server URL
   * @param {boolean} [isDisabled=false] - set to true to disable Applitools Eyes and use the webdriver directly
   * @param {Runner} [runner=new ClassicRunner()] - runner related to the wanted Eyes implementation
   * @return {Runner extends VisualGridRunner ? EyesVisualGrid<Driver, Element, Selector> : EyesClassic<Driver, Element, Selector>}
   */
  static from(serverUrl, isDisabled, runner = new ClassicRunner()) {
    if (serverUrl instanceof EyesRunner) {
      runner = serverUrl
      serverUrl = undefined
    }
    if (runner instanceof VisualGridRunner) {
      return new this.EyesVisualGrid(serverUrl, isDisabled, runner)
    }
    return new this.EyesClassic(serverUrl, isDisabled, runner)
  }
  /**
   * @param {string} [serverUrl] - The Eyes server URL.
   * @param {boolean} [isDisabled=false] - Set {@code true} to disable Applitools Eyes and use the webdriver directly.
   * @param {Object} [config] - Additional configuration object.
   */
  static fromBrowserInfo(serverUrl, isDisabled, config = {}) {
    let eyes

    if (config.browser) {
      eyes = new this.EyesVisualGrid(serverUrl, isDisabled)

      const cfg = new Configuration()
      const browsers = Array.isArray(config.browser) ? config.browser : [config.browser]
      browsers.forEach(browser => {
        // If it quacks like a duck
        if (browser.name) {
          cfg.addBrowser(browser.width, browser.height, browser.name)
        } else if (browser.deviceName) {
          cfg.addDeviceEmulation(browser.deviceName, browser.screenOrientation)
        }
      })
      eyes.setConfiguration(cfg)
    } else {
      eyes = new this.EyesClassic(serverUrl, isDisabled)
    }

    eyes._corsIframeHandle = CorsIframeHandles.BLANK

    return eyes
  }
}

module.exports = EyesFactory
