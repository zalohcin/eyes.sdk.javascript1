const assert = require('assert')
const {makeCoverageTests, makeRunTests} = require('../../src/coverage-tests/index')

const fakeSDK = {
  open: () => {},
  checkFrame: () => {},
  checkRegion: () => {},
  checkWindow: () => {},
  close: () => {},
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
      const name = 'blah'
      const initialize = () => {
        return {
          visit: () => {},
          open: () => {},
          checkRegion: () => {},
          close: () => {},
          cleanup: () => {
            count++
          },
        }
      }
      const supportedTests = [
        {name: 'checkRegionClassic', executionMode: {blah: true}},
        {name: 'checkRegionClassic', executionMode: {blahblah: true}},
      ]
      const {runTests} = makeRunTests(name, initialize)
      await runTests(supportedTests)
      assert.deepStrictEqual(count, 2)
    })
    it('cleanup should be optional', () => {
      const name = 'blah'
      const initialize = () => {
        return {
          visit: () => {},
          open: () => {},
          check: () => {},
          close: () => {},
        }
      }
      const supportedTests = [{name: 'checkRegionClassic', executionMode: {blah: true}}]
      const {runTests} = makeRunTests(name, initialize)
      assert.doesNotThrow(async () => {
        await runTests(supportedTests)
      })
    })
    it('should report errors from a run', async () => {
      const name = 'blah'
      const initialize = () => {
        return {
          visit: () => {},
          open: () => {
            throw 'blah error'
          },
          check: () => {},
          close: () => {},
          cleanup: () => {},
        }
      }
      const supportedTests = [{name: 'checkRegionClassic', executionMode: {blah: true}}]
      const {runTests} = makeRunTests(name, initialize)
      const {report} = await runTests(supportedTests)
      assert.deepStrictEqual(report.errors, {checkRegionClassic: {blah: 'blah error'}})
    })
  })
})
