const {DriverCheckSettings} = require('@applitools/eyes-sdk-core')
const WrappedElement = require('./WDIOWrappedElement')
const Frame = require('./WDIOFrame')

module.exports = DriverCheckSettings.specialize({WrappedElement, Frame})
