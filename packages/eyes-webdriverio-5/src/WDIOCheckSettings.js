const {DriverCheckSettings} = require('@applitools/eyes-sdk-core')
const WDIOWrappedElement = require('./WDIOWrappedElement')
const WDIOFrame = require('./WDIOFrame')

/**
 * @typedef {import('./SpecWrappedElement').Element} Element
 * @typedef {import('./SpecWrappedElement').Selector} Selector
 *
 * @typedef {import('@applitools/eyes-sdk-core').SpecCheckSettings<Element, Selector>} WDIOSpecCheckSettings
 */

/** @type {WDIOSpecCheckSettings} */
const SpecCheckSettings = {
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
}

const CheckSettings = DriverCheckSettings.specialize(SpecCheckSettings)

module.exports = CheckSettings
