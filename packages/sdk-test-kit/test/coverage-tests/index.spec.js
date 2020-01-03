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
  })
  describe('report', () => {
    let _report
    before(async () => {
      let _fakeSDK = {...fakeSDK}
      _fakeSDK.open = () => {
        throw new Error('blah error')
      }
      const supportedTests = [
        {name: 'TestCheckRegion', executionMode: {blah1: true}},
        {name: 'TestCheckRegion', executionMode: {blah2: true}},
        {name: 'TestCheckRegion', executionMode: {blah3: true}},
      ]
      const {runTests} = makeRunTests('blah', () => {
        return {..._fakeSDK}
      })
      const {report} = await runTests(supportedTests)
      _report = report
    })
    it('should contain errors from a run', async () => {
      assert.deepStrictEqual(_report.errors, [
        {
          name: 'Error',
          message: 'blah error',
          testName: 'TestCheckRegion',
          executionMode: {blah1: true},
        },
        {
          name: 'Error',
          message: 'blah error',
          testName: 'TestCheckRegion',
          executionMode: {blah2: true},
        },
        {
          name: 'Error',
          message: 'blah error',
          testName: 'TestCheckRegion',
          executionMode: {blah3: true},
        },
      ])
    })
    it('should contain stats from a run', () => {
      assert.deepStrictEqual(_report.stats.numberOfTests, 1)
      assert.deepStrictEqual(_report.stats.numberOfTestsPassed, 0)
      assert.deepStrictEqual(_report.stats.numberOfTestsFailed, 1)
      assert.deepStrictEqual(_report.stats.numberOfExecutions, 3)
      assert.deepStrictEqual(_report.stats.numberOfExecutionsPassed, 0)
      assert.deepStrictEqual(_report.stats.numberOfExecutionsFailed, 3)
    })
  })
})
