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

// TODO: add support for writing a tapDirPath (it's already supported in the config)
class DecoratedEyes extends sdk.EyesFactory {
  constructor({configPath, runner = new VisualGridRunner()} = {}) {
    // init
    const eyesInstance = super(runner)
    const _open = eyesInstance.open.bind(eyesInstance)
    const _check = eyesInstance.check.bind(eyesInstance)
    const _close = eyesInstance.close.bind(eyesInstance)
    let failTestcafeOnDiff = true

    // load config
    let applitoolsConfigJs
    try {
      applitoolsConfigJs = require(configPath)
    } catch (error) {
      applitoolsConfigJs = {}
    }

    // set api wrapper
    const api = {
      async open(...args) {
        if (args && args.length === 1 && TypeUtils.isObject(args[0]) && !spec.isDriver(args[0])) {
          const {t, appName, testName} = args[0]
          const config = translateArgsToConfig({...applitoolsConfigJs, ...args[0]})
          failTestcafeOnDiff = config.failTestcafeOnDiff
          eyesInstance.setConfiguration(config)
          return await _open(t, appName, testName)
        } else {
          return await _open(...args)
        }
      },
      async checkWindow(args) {
        await _check(args && TypeUtils.isObject(args) ? translateArgsToCheckSettings(args) : args)
      },
      async waitForResults(throwEx = true) {
        return await eyesInstance.getRunner().getAllTestResults(throwEx && failTestcafeOnDiff)
      },
      async close(throwEx = true) {
        return await _close(throwEx && failTestcafeOnDiff)
      },
    }
    eyesInstance.open = api.open
    eyesInstance.checkWindow = api.checkWindow
    eyesInstance.waitForResults = api.waitForResults
    eyesInstance.close = api.close
    return eyesInstance
  }
}

const modifiedSdk = {...sdk}
modifiedSdk.Eyes = DecoratedEyes
module.exports = {
  ...modifiedSdk,
}
