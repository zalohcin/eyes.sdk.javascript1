const {Frame} = require('@applitools/eyes-sdk-core')
const WrappedElement = require('./WDIOWrappedElement')

module.exports = Frame.specialize({WrappedElement})
