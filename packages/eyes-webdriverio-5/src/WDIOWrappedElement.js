const {EyesWrappedElement} = require('@applitools/eyes-sdk-core')
const SpecWrappedDriver = require('./SpecWrappedDriver')
const LegacyWrappedElement = require('./LegacyWrappedElement')

const WDIOWrappedElement = EyesWrappedElement.specialize(SpecWrappedDriver)

module.exports = LegacyWrappedElement(WDIOWrappedElement)
