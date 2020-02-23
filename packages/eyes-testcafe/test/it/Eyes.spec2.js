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
    const getScmInfoWithCache = function(branchName, parentBranchName) {
      if (!this.__cache) {
        this.__cache = {}
      }
      const cacheKey = `${branchName}-${parentBranchName}`
      if (!this.__cache[cacheKey]) {
        this.__cache[cacheKey] = true
        return `csm not from cache ${cacheKey}`
      }
      return `csm from cache ${cacheKey}`
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
    const res1 = await eyesClassic._getAndSaveScmMergeBaseTime('branchName', 'parentBranchName')
    assert.strictEqual(res1, 'csm not from cache branchName-parentBranchName')
    const res2 = await eyesClassic._getAndSaveScmMergeBaseTime('branchName', 'parentBranchName')
    assert.strictEqual(res2, 'csm from cache branchName-parentBranchName')
  })
})
