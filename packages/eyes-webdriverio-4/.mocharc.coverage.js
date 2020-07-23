const config = require('./.mocharc')
const uuid = require('uuid/v4')

process.env.APPLITOOLS_BATCH_NAME = 'JS Coverage Tests: eyes-webdriverio-4'
process.env.APPLITOOLS_BATCH_ID = uuid()
process.env.XUNIT_FILE = 'coverage-test-report.xml'

module.exports = {
  ...config,
  parallel: true,
  jobs: 15,
  reporter: 'spec-xunit-file',
  spec: [
    './test/coverage/generic/*.spec.js',
    '../sdk-coverage-tests/coverage-tests/custom/**/*.spec.js'
  ]
}
