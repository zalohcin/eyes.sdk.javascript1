const {filter} = require('../../src/coverage-tests/cli-util')
const assert = require('assert')

describe('cli-util', () => {
  const collection = [
    {name: 'a', executionMode: {isVisualGrid: true}},
    {name: 'a', executionMode: {isCssStitching: true}},
    {name: 'aa', executionMode: {isVisualGrid: true}},
    {name: 'b', executionMode: {isVisualGrid: true}},
  ]
  it('filter by name', () => {
    assert.deepStrictEqual(filter('a', {from: 'name', inside: collection}), [
      {name: 'a', executionMode: {isVisualGrid: true}},
      {name: 'a', executionMode: {isCssStitching: true}},
      {name: 'aa', executionMode: {isVisualGrid: true}},
    ])
    assert.deepStrictEqual(filter('b', {from: 'name', inside: collection}), [
      {name: 'b', executionMode: {isVisualGrid: true}},
    ])
  })
  it('filter by mode', () => {
    assert.deepStrictEqual(filter('isVisualGrid', {from: 'executionMode', inside: collection}), [
      {name: 'a', executionMode: {isVisualGrid: true}},
      {name: 'aa', executionMode: {isVisualGrid: true}},
      {name: 'b', executionMode: {isVisualGrid: true}},
    ])
  })
})
