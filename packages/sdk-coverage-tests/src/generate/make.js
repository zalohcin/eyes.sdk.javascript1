const {useEmitter, withHistory} = require('./emit')
const {generateBaselineName, generateFileName} = require('./names')
const {describeTest} = require('./describe')
const {isFunction} = require('../common-util')

function makeTests({tests, pages}, initializeSdk) {
  const output = []
  for (const [name, test] of Object.entries(tests)) {
    if (!isFunction(test.test)) {
      throw new Error(`Missing implementation for test ${name}`)
    }
    test.name = name
    output.push(executeTest(test, initializeSdk))
  }
  return output

  function executeTest(test) {
    const [output, emitter] = useEmitter()
    test.output = output
    test.meta = {features: test.features}
    if (test.env) {
      test.meta.browser = test.env.browser
      test.meta.mobile = Boolean(test.env.device)
      test.meta.native = Boolean(test.env.device && !test.env.browser)
    }
    // test.config.baselineName = generateBaselineName(test)
    const [history, sdk] = withHistory(initializeSdk(emitter, test))
    test.history = history
    if (test.page) sdk.driver.visit(pages[test.page])
    test.test(sdk)
    test.description = describeTest(test)
    test.filename = generateFileName(test)
    return test
  }
}

exports.makeTests = makeTests
