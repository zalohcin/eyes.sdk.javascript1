const {EyesWrappedElement} = require('@applitools/eyes-sdk-core')
const SpecWrappedElement = require('./SpecWrappedElement')

/**
 * @typedef {import('./SpecWrappedDriver').Driver} ProtractorDriver
 * @typedef {import('./SpecWrappedElement').Element} ProtractorElement
 * @typedef {import('./SpecWrappedElement').Selector} ProtractorSelector
 */

/** @type {EyesWrappedElement<ProtractorDriver, ProtractorElement, ProtractorSelector>} */
const ProtractorWrappedElement = EyesWrappedElement.specialize(SpecWrappedElement)

module.exports = ProtractorWrappedElement
