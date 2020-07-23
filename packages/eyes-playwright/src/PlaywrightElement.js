const {EyesElement} = require('@applitools/eyes-sdk-core')
const spec = require('./SpecDriver')

const PlaywrightDriver = EyesElement.specialize(spec)

module.exports = PlaywrightDriver
