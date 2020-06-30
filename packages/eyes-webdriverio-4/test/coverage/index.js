const {makeSpecEmitter, supportedTests} = require('@applitools/sdk-coverage-tests')

module.exports = {
  name: 'eyes.webdriverio.javascript4',
  initialize: makeSpecEmitter,
  supportedTests,
}
