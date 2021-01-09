const {
  EyesSDK,
  TypeUtils,
  VisualGridRunner,
  TestResultsFormatter,
  ConfigUtils,
  Logger,
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

process.env.APPLITOOLS_SCRIPT_RESULT_MAX_BYTE_LENGTH = 4718592 // 4.5 MB

class DecoratedEyesFactory extends sdk.EyesFactory {
  constructor({configPath, runner = new VisualGridRunner()} = {}) {
    // init
    const applitoolsConfigJs = ConfigUtils.getConfig({configPath})
    runner.testConcurrency = {
      testConcurrency: applitoolsConfigJs.concurrency || applitoolsConfigJs.testConcurrency,
    }
    const eyesInstance = super(runner)
    const _open = eyesInstance.open.bind(eyesInstance)
    const _check = eyesInstance.check.bind(eyesInstance)
    const _close = eyesInstance.close.bind(eyesInstance)
    let failTestcafeOnDiff = true
    let tapDirPath

    // set api wrapper
    const api = {
      async open(...args) {
        let openArgs, config
        if (args && args.length === 1 && TypeUtils.isObject(args[0]) && !spec.isDriver(args[0])) {
          const {t, appName, testName} = args[0]
          openArgs = [t, appName, testName]
          config = translateArgsToConfig({...applitoolsConfigJs, ...args[0]})
        } else {
          openArgs = args
          config = translateArgsToConfig(applitoolsConfigJs)
        }
        failTestcafeOnDiff = config.failTestcafeOnDiff
        tapDirPath = config.tapDirPath
        if (!process.env.APPLITOOLS_USE_PRELOADED_CONFIG) eyesInstance.setConfiguration(config)
        eyesInstance.logger = new Logger(process.env.APPLITOOLS_SHOW_LOGS || config.getShowLogs())
        return await _open(...openArgs)
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
modifiedSdk.EyesFactory = DecoratedEyesFactory
module.exports = {
  ...modifiedSdk,
}
