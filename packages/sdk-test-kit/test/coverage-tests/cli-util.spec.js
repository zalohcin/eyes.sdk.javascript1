const assert = require('assert')
const {
  findUnsupportedTests,
  findUnimplementedCommands,
} = require('../../src/coverage-tests/cli-util')
const {makeCoverageTests} = require('../../src/coverage-tests/index')
const {supportedCommands} = require('../../src/coverage-tests/tests')

describe('cli-util', () => {
  describe('doHealthCheck', () => {
    it('finds unsupported tests', () => {
      const sdkImplementation = {
        supportedTests: [],
      }
      const totalNumberOfTests = Object.keys(makeCoverageTests()).length
      assert.deepStrictEqual(findUnsupportedTests(sdkImplementation).length, totalNumberOfTests)
    })
    it('finds unimplemented commands', () => {
      const sdkImplementation = {
        initialize: () => {},
      }
      const totalNumberOfCommands = supportedCommands.length
      assert.deepStrictEqual(
        findUnimplementedCommands(sdkImplementation).length,
        totalNumberOfCommands,
      )
    })
  })
})
