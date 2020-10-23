const makeTemplate = require('./mocha-template')
const makeEmitter = require('./spec-emitter')
const overrideTests = require('./override-tests')

module.exports = {
  outPath: './test/generic',
  ext: '.spec.js',
  testsPath: '../sdk-shared/coverage-tests/generic/tests.js',
  initializeSdk: makeEmitter,
  testFrameworkTemplate: makeTemplate,
  overrideTests,
}
