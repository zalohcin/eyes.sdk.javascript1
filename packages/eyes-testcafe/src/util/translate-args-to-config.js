const {Configuration} = require('@applitools/eyes-sdk-core')

module.exports = args => {
  const configArgs = {
    ...args,
  }
  configArgs.browsersInfo = configArgs.browser
  configArgs.environmentName = configArgs.envName
  delete configArgs.browser
  delete configArgs.envName
  return new Configuration(configArgs)
}
