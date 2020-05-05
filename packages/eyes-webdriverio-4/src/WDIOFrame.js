const {Frame} = require('@applitools/eyes-sdk-core')
const WrappedElement = require('./WDIOWrappedElement')

Frame.specialize({WrappedElement})

module.exports = Frame
