const {EyesWrappedElement} = require('@applitools/eyes-sdk-core')
const SpecWrappedDriver = require('./SpecWrappedDriver')
const LegacyWrappedElement = require('./LegacyWrappedElement')
/** @type {import('./SpecWrappedElement'.WDIOSpecElement)} */
const SpecWrappedElement = require('./SpecWrappedElement')

const WDIOWrappedElement = EyesWrappedElement.specialize(SpecWrappedElement)

module.exports = LegacyWrappedElement(WDIOWrappedElement)
