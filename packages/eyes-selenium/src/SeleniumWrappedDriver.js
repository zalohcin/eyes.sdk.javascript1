const {EyesWrappedDriver} = require('@applitools/eyes-sdk-core')
const LegacyWrappedDriver = require('./LegacyWrappedDriver')
const SpecWrappedDriver = require('./SpecWrappedDriver')

/**
 * @typedef {import('./selenium3/SpecWrappedDriver').Driver|import('./selenium4/SpecWrappedDriver').Driver} SeleniumDriver
 * @typedef {import('./selenium3/SpecWrappedElement').Element|import('./selenium4/SpecWrappedElement').Element} SeleniumElement
 * @typedef {import('./selenium3/SpecWrappedElement').Selector|import('./selenium4/SpecWrappedElement').Selector} SeleniumSelector
 */

/** @type {EyesWrappedDriver<SeleniumDriver, SeleniumElement, SeleniumSelector>} */
const SeleniumWrappedDriver = EyesWrappedDriver.specialize(SpecWrappedDriver, {
  /** @override */
  switchTo(proxies) {
    const switchTo = this._driver.switchTo()
    return new Proxy(switchTo, {
      get(target, key, receiver) {
        switch (key) {
          case 'defaultContent':
            return proxies.switchToFrame
          case 'frame':
            return proxies.switchToFrame
          case 'parentFrame':
            return proxies.switchToParentFrame
          default:
            return Reflect.get(target, key, receiver)
        }
      },
    })
  },
  /** @override */
  async get(proxies, url) {
    return proxies.visit(url)
  },
})

module.exports = LegacyWrappedDriver(SeleniumWrappedDriver)
