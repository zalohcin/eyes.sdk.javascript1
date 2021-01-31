const convert = require('xml-js')
const {logDebug} = require('../log')

function convertJunitXmlToResultSchema({junit, browser, metadata}) {
  const tests = parseJunitXmlForTests(junit).filter(test => !test.skipped && !test.ignored)
  logDebug(tests)
  return tests.map(test => {
    const testName = parseBareTestName(test._attributes.name)
    const meta = metadata[testName] || {}
    return {
      test_name: meta.name || testName,
      parameters: {
        browser: browser || 'chrome',
        mode: meta.executionMode,
      },
      passed: !test.failure,
      isGeneric: meta.isGeneric,
      isSkipped: meta.skip || meta.skipEmit || false, // we explicitly set false to preserve backwards compatibility
    }
  })
}

function parseBareTestName(testCaseName) {
  return testCaseName
    .replace(/Coverage Tests /, '')
    .replace(/\(.*\)/, '')
    .trim()
}

function parseJunitXmlForTests(xmlResult) {
  const jsonResult = JSON.parse(convert.xml2json(xmlResult, {compact: true, spaces: 2}))
  if (jsonResult.hasOwnProperty('testsuites')) {
    const testsuite = jsonResult.testsuites.testsuite
    return Array.isArray(testsuite)
      ? testsuite
          .map(suite => suite.testcase)
          .reduce((flatten, testcase) => flatten.concat(testcase), [])
      : Array.isArray(testsuite.testcase)
      ? testsuite.testcase
      : [testsuite.testcase]
  } else if (jsonResult.hasOwnProperty('testsuite')) {
    const testCase = jsonResult.testsuite.testcase
    return testCase.hasOwnProperty('_attributes') ? [testCase] : testCase
  } else throw new Error('Unsupported XML format provided')
}

module.exports = {
  convertJunitXmlToResultSchema,
  parseBareTestName,
  parseJunitXmlForTests,
}
