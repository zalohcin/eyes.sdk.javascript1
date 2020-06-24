const {Frame} = require('@applitools/eyes-sdk-core')
const WDIOWrappedElement = require('./WDIOWrappedElement')

/**
 * @typedef {import('./SpecWrappedDriver').Driver} WDIODriver
 * @typedef {import('./SpecWrappedElement').Element} WDIOElement
 * @typedef {import('./SpecWrappedElement').Selector} WDIOSelector
 */

/** @type {Frame<WDIODriver, WDIOElement, WDIOSelector>} */
const WDIOFrame = Frame.specialize({
  isSelector(selector) {
    return WDIOWrappedElement.isSelector(selector)
  },
  isCompatibleElement(element) {
    return WDIOWrappedElement.isCompatible(element)
  },
  isEqualElements(leftElement, rightElement) {
    return WDIOWrappedElement.equals(leftElement, rightElement)
  },
  createElement(logger, driver, element, selector) {
    return new WDIOWrappedElement(logger, driver, element, selector)
  },
})

module.exports = WDIOFrame
