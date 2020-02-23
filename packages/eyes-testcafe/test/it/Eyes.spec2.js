'use strict'

const assert = require('assert')
const {Eyes} = require('../../index')

describe('Eyes', function() {
  let eyesClassic, eyesClassic2, eyesClassic3

  before(function() {
    eyesClassic = new Eyes()
    eyesClassic2 = new Eyes()
    eyesClassic3 = new Eyes()

    const batchInfo = id => `batchInfo of ${id}`
    eyesClassic._runner._getBatchInfo = batchInfo
    eyesClassic2._runner._getBatchInfo = batchInfo
    eyesClassic3._runner._getBatchInfo = batchInfo
  })

  it('_getAndSaveBatchInfoFromServer() works', async function() {
    const [res1, res2, res3] = await Promise.all([
      eyesClassic._getAndSaveBatchInfoFromServer('id1'),
      eyesClassic2._getAndSaveBatchInfoFromServer('id1'),
      eyesClassic3._getAndSaveBatchInfoFromServer('id2'),
    ])
    assert.strictEqual(res1, 'batchInfo of id1')
    assert.strictEqual(res2, 'batchInfo of id1')
    assert.strictEqual(res3, 'batchInfo of id2')
  })
})
