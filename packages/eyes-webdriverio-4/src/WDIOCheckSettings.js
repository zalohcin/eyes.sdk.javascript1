const {CheckSettingsFactory} = require('@applitools/eyes-sdk-core')
const WDIOElement = require('./wrappers/WDIOElement')
const WDIOFrameReference = require('./wrappers/WDIOFrame')

module.exports = CheckSettingsFactory(WDIOElement, WDIOFrameReference)
