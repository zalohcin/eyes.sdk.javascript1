const assert = require('assert')
const {coverageTests} = require('../src/index')

describe('coverage-tests', () => {
  describe('coverageTests', () => {
    it('should be a collection of tests', () => {
      assert.ok(Object.keys(coverageTests).length)
    })
  })
})
