const {DriverCheckSettings} = require('@applitools/eyes-sdk-core')
const WDIOElement = require('./wrappers/WDIOElement')
const WDIOFrame = require('./wrappers/WDIOFrame')

DriverCheckSettings.specialize(WDIOElement, WDIOFrame)

module.exports = DriverCheckSettings
