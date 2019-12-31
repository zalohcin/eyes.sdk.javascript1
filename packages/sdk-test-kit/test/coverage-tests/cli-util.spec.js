const {filter, unique, findDifferencesBetween} = require('../../src/coverage-tests/cli-util')
const assert = require('assert')

describe('cli-util', () => {
  describe('findDifferencesBetween', () => {
    it('should return an array of differences if present', () => {
      assert.deepStrictEqual(findDifferencesBetween([0, 1, 2, 'a'], [0, 1, 2]), ['a'])
    })
  })
  describe('unique', () => {
    it('should return an array of unique values', () => {
      const result = unique([0, 1, 1, 1, 2])
      assert.deepStrictEqual(result.size, 3)
    })
  })
  describe('filter', () => {
    const collection = [
      {name: 'a', executionMode: {isVisualGrid: true}},
      {name: 'a', executionMode: {isCssStitching: true}},
      {name: 'aa', executionMode: {isVisualGrid: true}},
      {name: 'b', executionMode: {isVisualGrid: true}},
    ]
    it('by name', () => {
      assert.deepStrictEqual(filter('a', {from: 'name', inside: collection}), [
        {name: 'a', executionMode: {isVisualGrid: true}},
        {name: 'a', executionMode: {isCssStitching: true}},
        {name: 'aa', executionMode: {isVisualGrid: true}},
      ])
      assert.deepStrictEqual(filter('b', {from: 'name', inside: collection}), [
        {name: 'b', executionMode: {isVisualGrid: true}},
      ])
    })
    it('by execution mode', () => {
      assert.deepStrictEqual(filter('isVisualGrid', {from: 'executionMode', inside: collection}), [
        {name: 'a', executionMode: {isVisualGrid: true}},
        {name: 'aa', executionMode: {isVisualGrid: true}},
        {name: 'b', executionMode: {isVisualGrid: true}},
      ])
    })
  })
})
