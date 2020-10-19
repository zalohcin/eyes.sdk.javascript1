const {
  makeEmitter,
  makeTemplate,
  overrideTests,
} = require('@applitools/sdk-shared/coverage-tests/generic')

module.exports = {
  name: 'eyes.webdriverio.javascript5',
  outPath: './test/coverage/generic',
  ext: '.spec.js',
  testsPath: '../sdk-shared/coverage-tests/generic/tests.js',
  initializeSdk: makeEmitter,
  testFrameworkTemplate: makeTemplate,
  overrideTests,
}
