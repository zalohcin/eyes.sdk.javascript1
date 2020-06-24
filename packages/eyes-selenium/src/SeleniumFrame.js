const {Frame} = require('@applitools/eyes-sdk-core')
const SeleniumWrappedElement = require('./SeleniumWrappedElement')

/**
 * @typedef {import('./selenium3/SpecWrappedDriver').Driver} Selenium3Driver
 * @typedef {import('./selenium3/SpecWrappedElement').Element} Selenium3Element
 * @typedef {import('./selenium3/SpecWrappedElement').Selector} Selenium3Selector
 * @typedef {Frame<Selenium3Driver, Selenium3Element, Selenium3Selector>} Selenium3Frame
 *
 * @typedef {import('./selenium4/SpecWrappedDriver').Driver} Selenium4Driver
 * @typedef {import('./selenium4/SpecWrappedElement').Element} Selenium4Element
 * @typedef {import('./selenium4/SpecWrappedElement').Selector} Selenium4Selector
 * @typedef {Frame<Selenium4Driver, Selenium4Element, Selenium4Selector>} Selenium4Frame
 */

/** @type {Selenium3Frame|Selenium4Frame} */
const SeleniumFrame = Frame.specialize({
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
})

module.exports = SeleniumFrame
