const {useEmitter, withHistory} = require('./emit')
const {describeTest} = require('./describe')
const {isFunction} = require('../common-util')

function makeTests({tests, pages}, initializeSdk) {
  return tests.map(test => {
    if (!isFunction(test.test)) {
      throw new Error(`Missing implementation for test ${test.name}`)
    }
    test.config.baselineName = test.config.baselineName || test.name
    const [output, emitter] = useEmitter()
    test.output = output
    test.meta = {features: test.features}
    if (test.env) {
      test.meta.browser = test.env.browser
      test.meta.mobile = Boolean(test.env.device)
      test.meta.native = Boolean(test.env.device && !test.env.browser)
    }
    const [history, sdk] = withHistory(initializeSdk(emitter, test))
    test.history = history
    if (test.page) sdk.driver.visit(pages[test.page])
    test.test(sdk)
    test.description = describeTest(test)
    test.filename = test.name
    return test
  })
}

exports.makeTests = makeTests
