const config = require('./.mocharc')
const uuid = require('uuid/v4')

process.env.APPLITOOLS_BATCH_NAME = 'JS Coverage Tests: eyes-selenium'
process.env.APPLITOOLS_BATCH_ID = uuid()
process.env.XUNIT_FILE = 'coverage-test-report.xml'

module.exports = {
  ...config,
  jobs: 15,
  reporter: 'spec-xunit-file',
  spec: [
    './test/coverage/generic/*.spec.js',
    '../sdk-coverage-tests/coverage-tests/custom/**/*.spec.js'
    // 'x/*.js',
    // 'y/*.js'
  ],
  grep: 'AppiumAndroidCheckRegion',
  invert: true
}
