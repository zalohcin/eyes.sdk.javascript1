const assert = require('assert')
const {makeCoverageTests} = require('../../src/coverage-tests/index')

const fakeSDK = {
  open: () => {},
  check: () => {},
  close: () => {},
}

describe('coverage-tests', () => {
  it('should return a collection of tests for an implemented SDK', () => {
    const tests = makeCoverageTests(fakeSDK)
    assert.ok(Object.keys(tests).length)
  })
})
