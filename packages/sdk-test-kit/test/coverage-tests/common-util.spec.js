const {filter, unique, findDifferencesBetweenCollections} = require('../../src/coverage-tests/common-util')
const assert = require('assert')

describe('common-util', () => {
  describe('findDifferencesBetweenCollections', () => {
    it('should support arrays', () => {
      assert.deepStrictEqual(findDifferencesBetweenCollections([0, 1, 2, 'a'], [0, 1, 2]), ['a'])
    })
    it('should support objects (keys)', () => {
      assert.deepStrictEqual(findDifferencesBetweenCollections({a: 0, b: 1, c: 2, d: 'a'}, {a: 0, b: 1, c: 2}), ['d'])
    })
    it('should support mixing arrays and objects', () => {
      assert.deepStrictEqual(findDifferencesBetweenCollections(['a', 'b', 'c', 'd'], {a: 0, b: 0, c: 0}), ['d'])
    })
    it('should deduplicate guest collections', () => {
      assert.deepStrictEqual(findDifferencesBetweenCollections([0, 1, 2, 'a'], [0, 1, 1, 1, 2]), ['a'])
    })
    it('should handle undefined inputs', () => {
      assert.deepStrictEqual(findDifferencesBetweenCollections([0, 1, 2, 'a'], undefined), [0, 1, 2, 'a'])
      assert.deepStrictEqual(findDifferencesBetweenCollections(undefined, [0, 1, 2, 'a']), [])
      assert.deepStrictEqual(findDifferencesBetweenCollections(undefined, undefined), [])
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
