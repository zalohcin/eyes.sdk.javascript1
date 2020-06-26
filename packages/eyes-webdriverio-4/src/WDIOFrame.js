const {Frame} = require('@applitools/eyes-sdk-core')
const WDIOWrappedElement = require('./WDIOWrappedElement')

/**
 * @typedef {import('./SpecWrappedDriver').Driver} Driver
 * @typedef {import('./SpecWrappedElement').Element} Element
 * @typedef {import('./SpecWrappedElement').Selector} Selector
 *
 * @typedef {import('@applitools/eyes-sdk-core').SpecFrame<Driver, Element, Selector>} WDIOSpecFrame
 */

/** @type {WDIOSpecFrame} */
const SpecFrame = {
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
}

const WDIOFrame = Frame.specialize(SpecFrame)

module.exports = WDIOFrame
