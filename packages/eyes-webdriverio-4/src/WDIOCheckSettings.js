const {DriverCheckSettings} = require('@applitools/eyes-sdk-core')
const WrappedElement = require('./WDIOWrappedElement')
const Frame = require('./WDIOFrame')

DriverCheckSettings.specialize({WrappedElement, Frame})

module.exports = DriverCheckSettings
