const {makeSpecEmitter, supportedTests} = require('@applitools/sdk-coverage-tests')

module.exports = {
  name: 'eyes-protractor',
  initialize: makeSpecEmitter,
  supportedTests,
}
