const {EyesSDK, TypeUtils, Configuration} = require('@applitools/eyes-sdk-core')
const VisualGridClient = require('@applitools/visual-grid-client')
const spec = require('./spec-driver')
const {version} = require('../package.json')

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
          const config = new Configuration()
          // options noted at https://www.npmjs.com/package/@applitools/eyes-testcafe#configuration-properties
          // browser
          config.setBrowsersInfo(args[0].browser)
          // batchId
          // batchName
          // baselineEnvName
          // envName
          // ignoreCaret
          // matchLevel
          // baselineBranchName
          // parentBranchName
          // saveFailedTests
          // saveNewTests
          // properties
          // ignoreDisplacements
          // compareWithParentBranch
          // ignoreBaseline
          // notifyOnCompletion
          // accessibilityValidation
          eyesInstance.setConfiguration(config)
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
