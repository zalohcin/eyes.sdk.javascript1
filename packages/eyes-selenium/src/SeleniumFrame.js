const {Frame} = require('@applitools/eyes-sdk-core')
const SeleniumWrappedElement = require('./SeleniumWrappedElement')

/**
 * @typedef {import('./selenium3/SpecWrappedDriver').Driver|import('./selenium4/SpecWrappedDriver').Driver} SeleniumDriver
 * @typedef {import('./selenium3/SpecWrappedElement').Element|import('./selenium4/SpecWrappedElement').Element} SeleniumElement
 * @typedef {import('./selenium3/SpecWrappedElement').Selector|import('./selenium4/SpecWrappedElement').Selector} SeleniumSelector
 */

/** @type {Frame<SeleniumDriver, SeleniumElement, SeleniumSelector>} */
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
