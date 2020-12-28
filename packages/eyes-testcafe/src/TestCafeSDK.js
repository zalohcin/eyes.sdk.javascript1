const {EyesSDK, TypeUtils, VisualGridRunner} = require('@applitools/eyes-sdk-core')
const VisualGridClient = require('@applitools/visual-grid-client')
const spec = require('./spec-driver')
const {version} = require('../package.json')
const {translateArgsToConfig, makeTranslateArgsToCheckSettings} = require('./util')
const sdk = EyesSDK({
  name: 'eyes.testcafe',
  version,
  spec,
  VisualGridClient,
})
const translateArgsToCheckSettings = makeTranslateArgsToCheckSettings(sdk.CheckSettings)

// TODO: also support applitools.config.js
class DecoratedEyes extends sdk.EyesFactory {
  constructor(serverUrl, isDisabled, runner = new VisualGridRunner()) {
    const eyesInstance = super(serverUrl, isDisabled, runner)
    const _open = eyesInstance.open.bind(eyesInstance)
    const _check = eyesInstance.check.bind(eyesInstance)
    const api = {
      async open(...args) {
        if (args && args.length === 1 && TypeUtils.isObject(args[0]) && !spec.isDriver(args[0])) {
          const {t, appName, testName} = args[0]
          eyesInstance.setConfiguration(translateArgsToConfig(args[0]))
          return await _open(t, appName, testName)
        } else {
          return await _open(...args)
        }
      },
      async checkWindow(args) {
        await _check(args && TypeUtils.isObject(args) ? translateArgsToCheckSettings(args) : args)
      },
      async waitForResults(throwEx = true) {
        return await eyesInstance.getRunner().getAllTestResults(throwEx)
      },
    }
    eyesInstance.open = api.open
    eyesInstance.checkWindow = api.checkWindow
    eyesInstance.waitForResults = api.waitForResults
    return eyesInstance
  }
}

const modifiedSdk = {...sdk}
modifiedSdk.Eyes = DecoratedEyes
module.exports = {
  ...modifiedSdk,
}
