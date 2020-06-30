const {makeSpecEmitter, supportedTests} = require('@applitools/sdk-coverage-tests')

module.exports = {
  name: 'eyes.webdriverio.javascript5',
  initialize: makeSpecEmitter,
  supportedTests,
}
