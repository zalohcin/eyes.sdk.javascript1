const {EyesWrappedElement} = require('@applitools/eyes-sdk-core')
const LegacyWrappedElement = require('./LegacyWrappedElement')

const SpecWrappedElement = require('./SpecWrappedElement')

const WDIOWrappedElement = EyesWrappedElement.specialize(SpecWrappedElement)

module.exports = LegacyWrappedElement(WDIOWrappedElement)
