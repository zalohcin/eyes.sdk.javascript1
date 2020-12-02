const EyesVisualGrid = require('../../lib/sdk/EyesVisualGrid')
const DiffsFoundError = require('../../lib/errors/DiffsFoundError')
const assert = require('assert')

describe('EyesVisualGrid', () => {
  describe('close', () => {
    it('should get error from results collection', () => {
      const error = new DiffsFoundError()
      const input = [
        {}, // represents a valid test result status object
        error,
      ]
      const actual = EyesVisualGrid.__getErrorFromResults(input)
      const expected = error
      assert.deepStrictEqual(actual, expected)
    })
  })
})
