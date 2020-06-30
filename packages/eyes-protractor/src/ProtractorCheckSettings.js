const {DriverCheckSettings} = require('@applitools/eyes-sdk-core')
const ProtractorWrappedElement = require('./ProtractorWrappedElement')
const ProtractorFrame = require('./ProtractorFrame')

/**
 * @typedef {import('./SpecWrappedElement').Element} Element
 * @typedef {import('./SpecWrappedElement').Selector} Selector
 *
 * @typedef {import('@applitools/eyes-sdk-core').SpecCheckSettings<Element, Selector>} ProtractorSpecCheckSettings
 */

/** @type {ProtractorSpecCheckSettings} */
const SpecCheckSettings = {
  isSelector(selector) {
    return ProtractorWrappedElement.isSelector(selector)
  },
  isCompatibleElement(element) {
    return ProtractorWrappedElement.isCompatible(element)
  },
  createElementFromSelector(selector) {
    return ProtractorWrappedElement.fromSelector(selector)
  },
  createElementFromElement(element) {
    return ProtractorWrappedElement.fromElement(element)
  },
  isFrameReference(reference) {
    return ProtractorFrame.isReference(reference)
  },
  createFrameReference(reference) {
    return ProtractorFrame.fromReference(reference)
  },
}

const CheckSettings = DriverCheckSettings.specialize(SpecCheckSettings)

module.exports = CheckSettings
