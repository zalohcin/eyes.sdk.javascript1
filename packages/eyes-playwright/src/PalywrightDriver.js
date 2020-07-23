const {EyesDriver} = require('@applitools/eyes-sdk-core')
const PlaywrightContext = require('./PlaywrightContext')
const PlaywrightElement = require('./PlaywrightElement')
const spec = require('./SpecDriver')

const PlaywrightDriver = EyesDriver.specialize({
  ...spec,
  newContext(...args) {
    return new PlaywrightContext(...args)
  },
  newElement(...args) {
    return new PlaywrightElement(...args)
  },
})

module.exports = PlaywrightDriver
