const {
  makeEmitter,
  makeTemplate,
  testsOverrides,
} = require('@applitools/sdk-shared/coverage-tests/generic')

module.exports = {
  name: 'eyes.webdriverio.javascript5',
  outPath: './test/coverage/generic',
  ext: '.spec.js',
  testsPath: '../sdk-shared/coverage-tests/generic/tests.js',
    // 'https://raw.githubusercontent.com/applitools/sdk.coverage.tests/env-and-meta/tests.js',
  initialize: makeEmitter,
  testFrameworkTemplate: makeTemplate,
  testsOverrides,
}
