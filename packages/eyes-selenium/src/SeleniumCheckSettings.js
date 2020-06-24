const {DriverCheckSettings} = require('@applitools/eyes-sdk-core')
const SeleniumWrappedElement = require('./SeleniumWrappedElement')
const SeleniumFrame = require('./SeleniumFrame')

/**
 * @typedef {import('./selenium3/SpecWrappedElement').Element} Selenium3Element
 * @typedef {import('./selenium3/SpecWrappedElement').Selector} Selenium3Selector
 * @typedef {DriverCheckSettings<Selenium3Element, Selenium3Selector>} Selenium3CheckSettings
 *
 * @typedef {import('./selenium4/SpecWrappedElement').Element} Selenium4Element
 * @typedef {import('./selenium4/SpecWrappedElement').Selector} Selenium4Selector
 * @typedef {DriverCheckSettings<Selenium4Element, Selenium4Selector>} Selenium4CheckSettings
 */

/** @type {Selenium3CheckSettings|Selenium4CheckSettings} */
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
