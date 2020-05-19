const {EyesWrappedElement} = require('@applitools/eyes-sdk-core')
const SpecWrappedElement = require('./SpecWrappedElement')
const LegacyWrappedElement = require('./LegacyWrappedElement')

const SeleniumWrappedElement = EyesWrappedElement.specialize(SpecWrappedElement)

module.exports = LegacyWrappedElement(SeleniumWrappedElement)
