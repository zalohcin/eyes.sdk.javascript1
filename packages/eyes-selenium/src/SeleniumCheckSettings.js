const {DriverCheckSettings} = require('@applitools/eyes-sdk-core')
const SeleniumWrappedElement = require('./SeleniumWrappedElement')
const SeleniumFrame = require('./SeleniumFrame')

/**
 * @typedef {import('./selenium3/SpecWrappedDriver').Driver|import('./selenium4/SpecWrappedDriver').Driver} SeleniumDriver
 * @typedef {import('./selenium3/SpecWrappedElement').Element|import('./selenium4/SpecWrappedElement').Element} SeleniumElement
 * @typedef {import('./selenium3/SpecWrappedElement').Selector|import('./selenium4/SpecWrappedElement').Selector} SeleniumSelector
 */

/** @type {DriverCheckSettings<SeleniumDriver, SeleniumElement, SeleniumSelector>} */
const SeleniumCheckSettings = DriverCheckSettings.specialize({
  isSelector(selector) {
    return SeleniumWrappedElement.isSelector(selector)
  },
  isCompatibleElement(element) {
    return SeleniumWrappedElement.isCompatible(element)
  },
  createElementFromSelector(selector) {
    return SeleniumWrappedElement.fromSelector(selector)
  },
  createElementFromElement(element) {
    return SeleniumWrappedElement.fromElement(element)
  },
  isFrameReference(reference) {
    return SeleniumFrame.isReference(reference)
  },
  createFrameReference(reference) {
    return SeleniumFrame.fromReference(reference)
  },
})

module.exports = SeleniumCheckSettings
