const {
  makeEmitter,
  makeTemplate,
  supportedTests,
} = require('../../../sdk-shared/coverage-tests/generic')

module.exports = {
  name: 'eyes.playwright',
  out: './test/coverage/generic',
  ext: '.spec.js',
  initialize: makeEmitter,
  testFrameworkTemplate: makeTemplate,
  supportedTests,
  // testsUrl: 'https://raw.githubusercontent.com/applitools/sdk.coverage.tests/env-and-meta/tests.js',
  testsPath: '../sdk-shared/coverage-tests/generic/tests.js',
}
