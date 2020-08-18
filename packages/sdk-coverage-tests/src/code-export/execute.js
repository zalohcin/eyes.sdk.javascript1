const {mergeObjects, isFunction} = require('../common-util')
const {useEmitter, withHistory} = require('./emit')
const {testToNames} = require('./parser')

function makeEmitTests(initializeSdkImplementation, {tests, pages}) {
  const output = []
  function emitTests(supportedTests) {
    for (const [name, variants] of Object.entries(supportedTests)) {
      for (const testVariant of variants) {
        const test = makeTest(tests[name], testVariant)
        if (!isFunction(test.test)) {
          throw new Error(`Missing implementation for test ${name}`)
        }
        test.key = name
        if (test.page) test.visit = pages[test.page]
        output.push(executeTest(test, initializeSdkImplementation))
      }
    }
    return output
  }
  return {emitTests}
}

function makeTest(base, custom) {
  if (isFunction(base)) base = {test: base}
  if (isFunction(custom)) custom = {test: custom}
  if (!base) return custom
  if (!custom) return base
  return mergeObjects(custom, base)
}

function executeTest(test, initializeSdk) {
  const [output, emitter] = useEmitter()
  test.output = output
  test.meta = {features: test.features}
  if (test.env) {
    test.meta.browser = test.env.browser
    test.meta.mobile = Boolean(test.env.device)
    test.meta.native = Boolean(test.env.device && !test.env.browser)
  }
  const [history, sdk] = withHistory(
    initializeSdk(emitter, {...test, name: emitter.useRef('testName')}),
  )
  test.history = history
  test.test(sdk)
  const {testName, baselineName} = testToNames(test)
  emitter.addHook(
    'vars',
    emitter.useSyntax('var', {
      constant: true,
      name: 'testName',
      type: 'String',
      value: `"${baselineName}"`,
    }),
  )
  test.name = testName
  console.log(test.name, '-', test.key, '\n')
  return test
}

exports.makeEmitTests = makeEmitTests
