const {DriverCheckSettings} = require('@applitools/eyes-sdk-core')
const WDIOElement = require('./WDIOElement')
const WDIOFrame = require('./WDIOFrame')

DriverCheckSettings.specialize(WDIOElement, WDIOFrame)

module.exports = DriverCheckSettings
