const {EyesWrappedDriver} = require('@applitools/eyes-sdk-core')
const SpecWrappedDriver = require('./SpecWrappedDriver')
const WDIOFrame = require('./WDIOFrame')
const WDIOWrappedElement = require('./WDIOWrappedElement')
const LegacyWrappedDriver = require('./LegacyWrappedDriver')

const WDIOWrappedDriver = EyesWrappedDriver.specialize(
  {
    ...SpecWrappedDriver,
    createElement(logger, driver, element, selector) {
      return new WDIOWrappedElement(logger, driver, element, selector)
    },
    createFrameReference(reference) {
      return WDIOFrame.fromReference(reference)
    },
  },
  {
    /** @override */
    async switchToFrame(proxies, reference) {
      return proxies.switchToFrame(reference)
    },
    /** @override */
    async switchToParentFrame(proxies) {
      return proxies.switchToParentFrame()
    },
    /** @override */
    async url(proxies, url) {
      return proxies.visit(url)
    },
  },
)

module.exports = LegacyWrappedDriver(WDIOWrappedDriver)
