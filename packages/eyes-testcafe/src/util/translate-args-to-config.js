const {Configuration} = require('@applitools/eyes-sdk-core')

module.exports = args => {
  const configArgs = {
    ...args,
  }
  configArgs.browsersInfo = configArgs.browser
  configArgs.environmentName = configArgs.envName
  configArgs.batch = {
    id: configArgs.batchId,
    name: configArgs.batchName,
    notifyOnCompletion: configArgs.notifyOnCompletion,
  }
  delete configArgs.browser
  delete configArgs.envName
  const config = new Configuration(configArgs)
  config.setMatchLevel(args.matchLevel)
  config.setIgnoreDisplacements(args.ignoreDisplacements)
  config.setAccessibilityValidation(args.accessibilityValidation)
  return config
}
