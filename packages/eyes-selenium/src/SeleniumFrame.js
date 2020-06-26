const {Frame} = require('@applitools/eyes-sdk-core')
const SeleniumWrappedElement = require('./SeleniumWrappedElement')

/**
 * @typedef {import('./SpecWrappedDriver').Driver} Driver
 * @typedef {import('./SpecWrappedElement').Element} Element
 * @typedef {import('./SpecWrappedElement').Selector} Selector
 *
 * @typedef {import('@applitools/eyes-sdk-core').SpecFrame<Driver, Element, Selector>} SeleniumSpecFrame
 */

/** @type {SeleniumSpecFrame} */
const SpecFrame = {
  isSelector(selector) {
    return SeleniumWrappedElement.isSelector(selector)
  },
  isCompatibleElement(element) {
    return SeleniumWrappedElement.isCompatible(element)
  },
  isEqualElements(leftElement, rightElement) {
    return SeleniumWrappedElement.equals(leftElement, rightElement)
  },
  createElement(logger, driver, element, selector) {
    return new SeleniumWrappedElement(logger, driver, element, selector)
  },
}

const SeleniumFrame = Frame.specialize(SpecFrame)

module.exports = SeleniumFrame
