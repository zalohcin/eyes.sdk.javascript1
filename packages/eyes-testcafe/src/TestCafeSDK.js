const {EyesSDK, TypeUtils} = require('@applitools/eyes-sdk-core')
const VisualGridClient = require('@applitools/visual-grid-client')
const spec = require('./spec-driver')
const {version} = require('../package.json')
const translateArgsToConfig = require('./util/translate-open-args-to-config')
const translateArgsToCheckSettings = require('./util/translate-check-args-to-check-settings')

const sdk = EyesSDK({
  name: 'eyes.testcafe',
  version,
  spec,
  VisualGridClient,
})

// TODO: also support applitools.config.js
// TODO: default to EyesVisualGrid
// TODO: pull in readme from other repo
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
      async checkWindow(args) {
        await _check(args && TypeUtils.isObject(args) ? translateArgsToCheckSettings(args) : args)
      },
    }
    eyesInstance.open = api.open
    eyesInstance.checkWindow = api.checkWindow
    return eyesInstance
  }
}

const modifiedSdk = {...sdk}
modifiedSdk.EyesFactory = DecoratedEyesFactory
module.exports = {
  ...modifiedSdk,
}
