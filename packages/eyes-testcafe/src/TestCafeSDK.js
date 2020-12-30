const {
  EyesSDK,
  TypeUtils,
  VisualGridRunner,
  TestResultsFormatter,
  ConfigUtils,
} = require('@applitools/eyes-sdk-core')
const VisualGridClient = require('@applitools/visual-grid-client')
const spec = require('./spec-driver')
const {version} = require('../package.json')
const {translateArgsToConfig, makeTranslateArgsToCheckSettings, writeTapFile} = require('./util')
const sdk = EyesSDK({
  name: 'eyes.testcafe',
  version,
  spec,
  VisualGridClient,
})
const translateArgsToCheckSettings = makeTranslateArgsToCheckSettings(sdk.CheckSettings)

// TODO:
// Update README to remove ref to rejectOnError
// Confirm proxy issue re: 1.9.x
// Run generic VG coverage tests
// Port test-server custom coverage tests over
// Confirm tests on 1.7.x - 1.10.x
// Add support for nested iframes
// Add support for CORS iframes (might be fixed with nested iframe support)
class DecoratedEyes extends sdk.EyesFactory {
  constructor({configPath, runner = new VisualGridRunner()} = {}) {
    // init
    const eyesInstance = super(runner)
    const _open = eyesInstance.open.bind(eyesInstance)
    const _check = eyesInstance.check.bind(eyesInstance)
    const _close = eyesInstance.close.bind(eyesInstance)
    const applitoolsConfigJs = ConfigUtils.getConfig({configPath})
    let failTestcafeOnDiff = true
    let tapDirPath

    // set api wrapper
    const api = {
      async open(...args) {
        if (args && args.length === 1 && TypeUtils.isObject(args[0]) && !spec.isDriver(args[0])) {
          const {t, appName, testName} = args[0]
          const config = translateArgsToConfig({...applitoolsConfigJs, ...args[0]})
          failTestcafeOnDiff = config.failTestcafeOnDiff
          tapDirPath = config.tapDirPath
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
        const resultsSummary = await eyesInstance
          .getRunner()
          .getAllTestResults(throwEx && failTestcafeOnDiff)
        if (tapDirPath) {
          const results = resultsSummary.getAllResults().map(r => r.getTestResults())
          const formatter = new TestResultsFormatter(results)
          writeTapFile({tapDirPath, formatter})
        }
        return resultsSummary
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
