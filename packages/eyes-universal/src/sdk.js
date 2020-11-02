const {EyesSDK} = require('@applitools/eyes-sdk-core')
const VisualGridClient = require('@applitools/visual-grid-client')
const makeSpecDriver = require('./spec-driver')
const {version} = require('../package.json')

function makeSDK(socket, config) {
  return EyesSDK({
    name: `eyes-universal/${config.name}`,
    version: `${version}/${config.name}`,
    spec: makeSpecDriver(socket, config.supportedMethods),
    VisualGridClient,
  })
}

module.exports = makeSDK
