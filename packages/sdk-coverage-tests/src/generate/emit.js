const {useEmitter, withHistory} = require('../../emitter')
const {describeTest} = require('./describe')
const {isFunction, mergeObjects} = require('../../common-util')

function emitTests(tests, config) {
  let processedTests = Object.entries(tests).reduce((tests, [testName, {variants, ...test}]) => {
    test.name = testName
    test.config = test.config || {}
    if (variants) {
      Object.entries(variants).forEach(([variantName, overrides]) => {
        const testVariant = mergeObjects(test, overrides)
        testVariant.skip = testVariant.skip && !config.ignoreSkip
        if (variantName) testVariant.name += `__${variantName}`
        tests.push(testVariant)
      })
    } else {
      test.skip = test.skip && !config.ignoreSkip
      tests.push(test)
    }
    return tests
  }, [])

  if (!config.emitSkipped) {
    processedTests = processedTests.filter(test => !test.skip)
  }

  return processedTests.map(test => {
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
    const [history, sdk] = withHistory(config.initializeSdk(emitter, test))
    test.history = history
    if (test.page) sdk.driver.visit(config.pages[test.page])
    test.test(sdk)
    test.description = describeTest(test)
    test.filename = test.name
    return test
  })
}

exports.emitTests = emitTests
