const assert = require('assert')
const {
  findUnsupportedTests,
  findUnimplementedCommands,
  filterTestsByName,
  filterTestsByMode,
} = require('../../src/coverage-tests/cli-util')
const {makeCoverageTests} = require('../../src/coverage-tests/index')
const {supportedCommands} = require('../../src/coverage-tests/tests')

describe('cli-util', () => {
  describe('doRunTests', () => {
    it('filter tests by name', () => {
      assert.deepStrictEqual(filterTestsByName('a', [{name: 'a'}, {name: 'b'}]), [{name: 'a'}])
    })
    it('filter tests by mode', () => {
      assert.deepStrictEqual(
        filterTestsByMode('isBlah', [
          {name: 'a', executionMode: {isBlah: true}},
          {name: 'b', executionMode: {isHalb: true}},
        ]),
        [{name: 'a', executionMode: {isBlah: true}}],
      )
    })
    it.skip('full collection returned on undefined', () => {
      assert.deepStrictEqual(filterTestsByName(undefined, [{name: 'a'}, {name: 'b'}]), [
        {name: 'a'},
        {name: 'b'},
      ])
      assert.deepStrictEqual(
        filterTestsByMode(undefined, [
          {name: 'a', executionMode: {isBlah: true}},
          {name: 'b', executionMode: {isHalb: true}},
        ]),
        [
          {name: 'a', executionMode: {isBlah: true}},
          {name: 'b', executionMode: {isHalb: true}},
        ],
      )
    })
  })
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
