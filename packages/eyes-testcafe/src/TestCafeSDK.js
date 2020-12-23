const {EyesSDK, TypeUtils} = require('@applitools/eyes-sdk-core')
const VisualGridClient = require('@applitools/visual-grid-client')
const spec = require('./spec-driver')
const {version} = require('../package.json')
const translateArgsToConfig = require('./util/translate-args-to-config')

const sdk = EyesSDK({
  name: 'eyes.testcafe',
  version,
  spec,
  VisualGridClient,
})

class DecoratedEyesFactory extends sdk.EyesFactory {
  constructor() {
    const eyesInstance = super()
    const _open = eyesInstance.open.bind(eyesInstance)
    const _check = eyesInstance.check.bind(eyesInstance)
    const api = {
      async open(...args) {
        if (args && args.length === 1 && TypeUtils.isObject(args[0]) && !spec.isDriver(args[0])) {
          const {t, appName, testName} = args[0]
          eyesInstance.setConfiguration(translateArgsToConfig(args[0]))
          return await _open(t, appName, testName)
        }
        await _open(...args)
      },
      async checkWindow(...args) {
        await _check(...args)
      },
    }
    eyesInstance.open = api.open
    eyesInstance.check = api.checkWindow
    return eyesInstance
  }
}

const modifiedSdk = {...sdk}
modifiedSdk.EyesFactory = DecoratedEyesFactory
module.exports = {
  ...modifiedSdk,
}
