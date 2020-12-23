const {CheckSettings} = require('../TestCafeSDK')

module.exports = args => {
  const checkArgs = {...args}
  checkArgs.isFully = checkArgs.fully
  if (checkArgs.target && checkArgs.target === 'region' && checkArgs.selector)
    checkArgs.region = checkArgs.selector
  return new CheckSettings(checkArgs)
}
