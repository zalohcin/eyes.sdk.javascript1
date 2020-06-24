const {DriverCheckSettings} = require('@applitools/eyes-sdk-core')
const ProtractorWrappedElement = require('./ProtractorWrappedElement')
const ProtractorFrame = require('./ProtractorFrame')

/**
 * @typedef {import('./SpecWrappedDriver').Driver} ProtractorDriver
 * @typedef {import('./SpecWrappedElement').Element} ProtractorElement
 * @typedef {import('./SpecWrappedElement').Selector} ProtractorSelector
 */

/** @type {DriverCheckSettings<ProtractorDriver, ProtractorElement, ProtractorSelector>} */
const ProtractorCheckSettings = DriverCheckSettings.specialize({
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
})

module.exports = ProtractorCheckSettings
