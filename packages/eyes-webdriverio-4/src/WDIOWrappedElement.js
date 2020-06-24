const {EyesWrappedElement} = require('@applitools/eyes-sdk-core')
const SpecWrappedElement = require('./SpecWrappedElement')
const LegacyWrappedElement = require('./LegacyWrappedElement')

/**
 * @typedef {import('./SpecWrappedDriver').Driver} WDIODriver
 * @typedef {import('./SpecWrappedElement').Element} WDIOElement
 * @typedef {import('./SpecWrappedElement').Selector} WDIOSelector
 */

/** @type {EyesWrappedElement<WDIODriver, WDIOElement, WDIOSelector>} */
const WDIOWrappedElement = EyesWrappedElement.specialize(SpecWrappedElement)

module.exports = LegacyWrappedElement(WDIOWrappedElement)
