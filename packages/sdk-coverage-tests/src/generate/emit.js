const {useEmitter, withHistory} = require('../emitter')
const {describeTest} = require('./describe')
const {isFunction} = require('../common-util')

function emitTests(tests, config) {
  return tests.map(test => emitTest(test, config))
}

function emitTest(test, {makeSdk, fileTemplate}) {
  if (!isFunction(test.test)) {
    throw new Error(`Missing implementation for test ${test.name}`)
  }
  test.config.baselineName = test.config.baselineName || test.key
  const [output, emitter] = useEmitter()
  test.output = output
  test.meta = {features: test.features}
  if (test.env) {
    test.meta.browser = test.env.browser
    test.meta.mobile = Boolean(test.env.device)
    test.meta.native = Boolean(test.env.device && !test.env.browser)
  }
  const [history, sdk] = withHistory(makeSdk(emitter, test))
  test.history = history
  if (test.page) sdk.driver.visit(test.page)
  test.test(sdk)
  test.description = describeTest(test)
  test.code = fileTemplate(test)
  return test
}

module.exports = {emitTests, emitTest}
