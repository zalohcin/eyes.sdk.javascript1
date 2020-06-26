const {Frame} = require('@applitools/eyes-sdk-core')
const ProtractorWrappedElement = require('./ProtractorWrappedElement')

/**
 * @typedef {import('./SpecWrappedDriver').Driver} Driver
 * @typedef {import('./SpecWrappedElement').Element} Element
 * @typedef {import('./SpecWrappedElement').Selector} Selector
 *
 * @typedef {import('@applitools/eyes-sdk-core').SpecFrame<Driver, Element, Selector>} ProtractorSpecFrame
 */

/** @type {ProtractorSpecFrame} */
const SpecFrame = {
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
}

const ProtractorFrame = Frame.specialize(SpecFrame)

module.exports = ProtractorFrame
