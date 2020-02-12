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

    // save CSM info on runner
    const getScmInfoWithCache = function(arg) {
      if (!this.__cache) {
        this.__cache = {}
      }
      if (!this.__cache[arg]) {
        this.__cache[arg] = true
        return `csm not from cache ${arg}`
      }
      return `csm from cache ${arg}`
    }
    eyesClassic._runner.getScmInfoWithCache = getScmInfoWithCache
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

  it('_getAndSaveScmMergeBaseTime() works', async function() {
    const res1 = await eyesClassic._getAndSaveScmMergeBaseTime('parentBranchName')
    assert.strictEqual(res1, 'csm not from cache parentBranchName')
    const res2 = await eyesClassic._getAndSaveScmMergeBaseTime('parentBranchName')
    assert.strictEqual(res2, 'csm from cache parentBranchName')
  })
})
