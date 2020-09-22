const assert = require('assert')
const chunkify = require('../utils/chunkify')

describe('chunkify', () => {
  it('works with latin', async () => {
    const chunks = chunkify('abcdefgh1234', 4)
    assert.strictEqual(chunks.length, 3)
    assert.deepStrictEqual(chunks, ['abcd', 'efgh', '1234'])
  })

  it('works with cyrillic', async () => {
    const chunks = chunkify('абвгґдеє1234', 4)
    assert.strictEqual(chunks.length, 5)
    assert.deepStrictEqual(chunks, ['аб', 'вг', 'ґд', 'еє', '1234'])
  })

  it('works with emoji', async () => {
    const chunks = chunkify('😊🥺😉😍', 4)
    assert.strictEqual(chunks.length, 4)
    assert.deepStrictEqual(chunks, ['😊', '🥺', '😉', '😍'])
  })
})
