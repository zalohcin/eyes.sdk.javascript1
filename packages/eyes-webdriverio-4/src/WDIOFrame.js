const {Frame} = require('@applitools/eyes-sdk-core')
const WDIOElement = require('./WDIOElement')

Frame.specialize(WDIOElement)

module.exports = Frame
