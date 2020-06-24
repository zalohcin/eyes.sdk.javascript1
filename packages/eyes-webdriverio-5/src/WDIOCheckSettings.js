const {DriverCheckSettings} = require('@applitools/eyes-sdk-core')
const WDIOWrappedElement = require('./WDIOWrappedElement')
const WDIOFrame = require('./WDIOFrame')

/**
 * @typedef {import('./SpecWrappedDriver').Driver} WDIODriver
 * @typedef {import('./SpecWrappedElement').Element} WDIOElement
 * @typedef {import('./SpecWrappedElement').Selector} WDIOSelector
 */

/** @type {DriverCheckSettings<WDIODriver, WDIOElement, WDIOSelector>} */
const CheckSettings = DriverCheckSettings.specialize({
  isSelector(selector) {
    return WDIOWrappedElement.isSelector(selector)
  },
  isCompatibleElement(element) {
    return WDIOWrappedElement.isCompatible(element)
  },
  createElementFromSelector(selector) {
    return WDIOWrappedElement.fromSelector(selector)
  },
  createElementFromElement(element) {
    return WDIOWrappedElement.fromElement(element)
  },
  isFrameReference(reference) {
    return WDIOFrame.isReference(reference)
  },
  createFrameReference(reference) {
    return WDIOFrame.fromReference(reference)
  },
})

module.exports = CheckSettings
