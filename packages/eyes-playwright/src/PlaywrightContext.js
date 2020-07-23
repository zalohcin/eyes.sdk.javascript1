const {EyesContext} = require('@applitools/eyes-sdk-core')
const spec = require('./SpecDriver')

const PlaywrightContext = EyesContext.specialize(spec)

module.exports = PlaywrightContext
