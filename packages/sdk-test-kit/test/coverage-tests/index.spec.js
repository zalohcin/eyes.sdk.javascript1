const assert = require('assert')
const {makeCoverageTests, makeRunTests} = require('../../src/coverage-tests/index')

const fakeSDK = {
  visit: () => {},
  open: () => {},
  checkFrame: () => {},
  checkRegion: () => {},
  checkWindow: () => {},
  close: () => {},
  cleanup: () => {},
}

describe('coverage-tests', () => {
  describe('makeCoverageTests', () => {
    it('should return a collection of tests for an implemented SDK', () => {
      const tests = makeCoverageTests(fakeSDK)
      assert.ok(Object.keys(tests).length)
    })
  })

  describe('makeRunTests', () => {
    it('should return a run function', () => {
      const {runTests} = makeRunTests()
      assert.deepStrictEqual(typeof runTests, 'function')
    })
    it('should run tests with the provided implementation', async () => {
      let count = 0
      let _fakeSDK = {...fakeSDK}
      _fakeSDK.open = () => {
        count++
      }
      const supportedTests = [
        {name: 'TestCheckRegion', executionMode: {blah: true}},
        {name: 'TestCheckRegion', executionMode: {blahblah: true}},
      ]
      const {runTests} = makeRunTests('blah', () => {
        return {..._fakeSDK}
      })
      await runTests(supportedTests)
      assert.deepStrictEqual(count, 2)
    })
    it('cleanup should be optional', async () => {
      let _fakeSDK = {...fakeSDK}
      delete _fakeSDK.cleanup
      const supportedTests = [{name: 'TestCheckRegion', executionMode: {blah: true}}]
      const {runTests} = makeRunTests('blah', () => {
        return {..._fakeSDK}
      })
      const {report} = await runTests(supportedTests)
      assert.ok(!Object.keys(report.errors).length)
    })
    it('should report errors from a run', async () => {
      let _fakeSDK = {...fakeSDK}
      _fakeSDK.open = () => {
        throw 'blah error'
      }
      const supportedTests = [{name: 'TestCheckRegion', executionMode: {blah: true}}]
      const {runTests} = makeRunTests('blah', () => {
        return {..._fakeSDK}
      })
      const {report} = await runTests(supportedTests)
      assert.deepStrictEqual(report.errors, {TestCheckRegion: {blah: 'blah error'}})
    })
    it('should be able to output the report to a different schema', async () => {
      let _fakeSDK = {...fakeSDK}
      _fakeSDK.checkRegion = () => {
        throw 'blah error'
      }
      const supportedTests = [
        {name: 'TestCheckRegion', executionMode: {isCssStitching: true}},
        {name: 'TestCheckRegion', executionMode: {isVisualGrid: true}},
        {name: 'TestCheckWindow', executionMode: {isVisualGrid: true}},
      ]
      const {runTests} = makeRunTests('eyes-selenium', () => {
        return {..._fakeSDK}
      })
      const {report} = await runTests(supportedTests)
      const expectedReportSchema = {
        sdk: 'js_selenium_4',
        group: 'selenium',
        sandbox: true,
        results: [
          {
            test_name: 'TestCheckRegion',
            parameters: {
              browser: 'chrome',
              mode: 'css',
            },
            passed: false,
          },
          {
            test_name: 'TestCheckRegion',
            parameters: {
              browser: 'chrome',
              mode: 'visualgrid',
            },
            passed: false,
          },
          {
            test_name: 'TestCheckWindow',
            parameters: {
              browser: 'chrome',
              mode: 'visualgrid',
            },
            passed: true,
          },
        ],
      }
      assert.deepStrictEqual(report.toSendReportSchema(), expectedReportSchema)
    })
  })
})
