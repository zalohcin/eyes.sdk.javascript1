const {EyesWrappedDriver} = require('@applitools/eyes-sdk-core')
const SpecWrappedDriver = require('./SpecWrappedDriver')
const LegacyWrappedDriver = require('./LegacyWrappedDriver')

/**
 * @typedef {import('./SpecWrappedDriver').Driver} WDIODriver
 * @typedef {import('./SpecWrappedElement').Element} WDIOElement
 * @typedef {import('./SpecWrappedElement').Selector} WDIOSelector
 */

/** @type {EyesWrappedDriver<WDIODriver, WDIOElement, WDIOSelector>} */
const WDIOWrappedDriver = EyesWrappedDriver.specialize(SpecWrappedDriver, {
  /** @override */
  async frame(proxies, reference) {
    return proxies.switchToFrame(reference)
  },
  /** @override */
  async frameParent(proxies) {
    return proxies.switchToParentFrame()
  },
  /** @override */
  async url(proxies, url) {
    return proxies.visit(url)
  },
})

module.exports = LegacyWrappedDriver(WDIOWrappedDriver)
