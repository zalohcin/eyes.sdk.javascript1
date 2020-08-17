const {getNameFromObject} = require('../common-util')
const {parseTest} = require('./parser')

function convertExecutionModeToSuffix(executionMode) {
  if (executionMode.useStrictName) return ''
  switch (getNameFromObject(executionMode)) {
    case 'isVisualGrid':
      return '_VG'
    case 'isScrollStitching':
      return '_Scroll'
    default:
      return ''
  }
}

function makeEmitTests(initializeSdkImplementation, coverageTests) {
  let output = []
  function emitTests(supportedTests, {host, all = false} = {}) {
    supportedTests.forEach(supportedTest => {
      const coverageTest = coverageTests[supportedTest.name]
      if (
        !coverageTest ||
        !(typeof coverageTest === 'function' || typeof coverageTest.test === 'function')
      ) {
        throw new Error('missing implementation for test ' + supportedTest.name)
      }
      const coverageTestFunc = coverageTest.test || coverageTest
      const baselineTestName = `${supportedTest.name}${convertExecutionModeToSuffix(
        supportedTest.executionMode,
      )}`
      const branchName = supportedTest.baselineVersion
        ? `v${supportedTest.baselineVersion}`
        : 'master'
      const sdkImplementation = initializeSdkImplementation({
        baselineTestName,
        branchName,
        host,
        ...supportedTest,
        ...coverageTest,
      })
      const meta = {features: coverageTest.features}
      if (coverageTest.env) {
        meta.browser = coverageTest.env.browser
        meta.mobile = Boolean(coverageTest.env.device)
        meta.native = Boolean(coverageTest.env.device) && !coverageTest.env.browser
      }
      // test
      coverageTestFunc(sdkImplementation)
      // store
      const test = {
        name: baselineTestName,
        meta,
        disabled: !all && supportedTest.disabled,
        ...sdkImplementation.tracker.getOutput(),
      }
      output.push(test)
      console.log(baselineTestName)
      parseTest(test)
      console.log('\n')
    })
    return output
  }
  return {emitTests}
}

exports.makeEmitTests = makeEmitTests
