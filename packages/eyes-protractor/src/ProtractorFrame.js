const {Frame} = require('@applitools/eyes-sdk-core')
const ProtractorWrappedElement = require('./ProtractorWrappedElement')

/**
 * @typedef {import('./SpecWrappedDriver').Driver} ProtractorDriver
 * @typedef {import('./SpecWrappedElement').Element} ProtractorElement
 * @typedef {import('./SpecWrappedElement').Selector} ProtractorSelector
 */

/** @type {Frame<ProtractorDriver, ProtractorElement, ProtractorSelector>} */
const ProtractorFrame = Frame.specialize({
  isSelector(selector) {
    return ProtractorWrappedElement.isSelector(selector)
  },
  isCompatibleElement(element) {
    return ProtractorWrappedElement.isCompatible(element)
  },
  isEqualElements(leftElement, rightElement) {
    return ProtractorWrappedElement.equals(leftElement, rightElement)
  },
  createElement(logger, driver, element, selector) {
    return new ProtractorWrappedElement(logger, driver, element, selector)
  },
})

module.exports = ProtractorFrame
