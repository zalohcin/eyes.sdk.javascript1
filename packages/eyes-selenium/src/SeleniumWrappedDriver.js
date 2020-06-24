const {EyesWrappedDriver} = require('@applitools/eyes-sdk-core')
const LegacyWrappedDriver = require('./LegacyWrappedDriver')
const SpecWrappedDriver = require('./SpecWrappedDriver')

/**
 * @typedef {import('./selenium3/SpecWrappedDriver').Driver} Selenium3Driver
 * @typedef {import('./selenium3/SpecWrappedElement').Element} Selenium3Element
 * @typedef {import('./selenium3/SpecWrappedElement').Selector} Selenium3Selector
 * @typedef {EyesWrappedDriver<Selenium3Driver, Selenium3Element, Selenium3Selector>} Selenium3WrappedDriver
 *
 * @typedef {import('./selenium4/SpecWrappedDriver').Driver} Selenium4Driver
 * @typedef {import('./selenium4/SpecWrappedElement').Element} Selenium4Element
 * @typedef {import('./selenium4/SpecWrappedElement').Selector} Selenium4Selector
 * @typedef {EyesWrappedDriver<Selenium4Driver, Selenium4Element, Selenium4Selector>} Selenium4WrappedDriver
 */

/** @type {Selenium3WrappedDriver|Selenium4WrappedDriver} */
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
