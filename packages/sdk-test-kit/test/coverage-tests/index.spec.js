const assert = require('assert')
const {makeCoverageTests, _makeRun} = require('../../src/coverage-tests/index')

const fakeSDK = {
  open: () => {},
  check: () => {},
  close: () => {},
}

describe('coverage-tests', () => {
  describe('makeCoverageTests', () => {
    it('should return a collection of tests for an implemented SDK', () => {
      const tests = makeCoverageTests(fakeSDK)
      assert.ok(Object.keys(tests).length)
    })
  })

  describe('makeRun', () => {
    it.skip('should return a run function', () => {})
    it.skip('should run a test with the provided implementation', () => {})
    it.skip('should call the hook methods in the correct order', () => {})
    it.skip('should record and display errors correctly', () => {})
  })
})
