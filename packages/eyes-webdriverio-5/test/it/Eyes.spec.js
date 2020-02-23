'use strict'

const assert = require('assert')
const {Eyes, ClassicRunner, VisualGridRunner} = require('../../index')

describe('Eyes', function() {
  let eyesClassic, eyesClassic2, eyesClassic3, eyesVG, eyesVG2, eyesVG3
  let eyesClassicOtherRuuner, eyesVGOtherRunner

  before(function() {
    const cr = new ClassicRunner()
    eyesClassic = new Eyes(cr)
    eyesClassic2 = new Eyes(cr)
    eyesClassic3 = new Eyes(cr)
    eyesClassicOtherRuuner = new Eyes()

    const vgr = new VisualGridRunner()
    eyesVG = new Eyes(vgr)
    eyesVG2 = new Eyes(vgr)
    eyesVG3 = new Eyes(vgr)
    eyesVGOtherRunner = new Eyes()

    const batchInfo = id => `batchInfo of ${id}`
    eyesClassic._runner._getBatchInfo = batchInfo
    eyesClassic2._runner._getBatchInfo = batchInfo
    eyesClassic3._runner._getBatchInfo = batchInfo
    eyesVG._runner._getBatchInfo = batchInfo
    eyesVG2._runner._getBatchInfo = batchInfo
    eyesVG3._runner._getBatchInfo = batchInfo

    // save CSM info on runner
    const getScmInfoWithCache = function(branchName, parentBranchName) {
      if (!this.__cache) {
        this.__cache = {}
      }
      const argsKey = `${branchName}-${parentBranchName}`
      if (!this.__cache[argsKey]) {
        this.__cache[argsKey] = true
        return `csm not from cache ${argsKey}`
      }
      return `csm from cache ${argsKey}`
    }

    eyesClassic._runner.getScmInfoWithCache = getScmInfoWithCache
    eyesClassic2._runner.getScmInfoWithCache = getScmInfoWithCache
    eyesClassicOtherRuuner._runner.getScmInfoWithCache = getScmInfoWithCache
    eyesVG._runner.getScmInfoWithCache = getScmInfoWithCache
    eyesVG2._runner.getScmInfoWithCache = getScmInfoWithCache
    eyesVGOtherRunner._runner.getScmInfoWithCache = getScmInfoWithCache
  })

  it('_getAndSaveBatchInfoFromServer() works with classic runner', async function() {
    const [res1, res2, res3] = await Promise.all([
      eyesClassic._getAndSaveBatchInfoFromServer('id1'),
      eyesClassic2._getAndSaveBatchInfoFromServer('id1'),
      eyesClassic3._getAndSaveBatchInfoFromServer('id2'),
    ])
    assert.strictEqual(res1, 'batchInfo of id1')
    assert.strictEqual(res2, 'batchInfo of id1')
    assert.strictEqual(res3, 'batchInfo of id2')
  })

  it('_getAndSaveBatchInfoFromServer() works with VG runner', async function() {
    const [res1, res2, res3] = await Promise.all([
      eyesVG._getAndSaveBatchInfoFromServer('id1'),
      eyesVG2._getAndSaveBatchInfoFromServer('id1'),
      eyesVG3._getAndSaveBatchInfoFromServer('id2'),
    ])
    assert.strictEqual(res1, 'batchInfo of id1')
    assert.strictEqual(res2, 'batchInfo of id1')
    assert.strictEqual(res3, 'batchInfo of id2')
  })

  it('_getAndSaveScmMergeBaseTime() works with classic runner', async function() {
    const res1 = await eyesClassic._getAndSaveScmMergeBaseTime('branchName', 'parentBranchName')
    const res2 = await eyesClassic2._getAndSaveScmMergeBaseTime('branchName', 'parentBranchName')
    const res3 = await eyesClassicOtherRuuner._getAndSaveScmMergeBaseTime(
      'branchName',
      'parentBranchName',
    )

    assert.strictEqual(res1, 'csm not from cache branchName-parentBranchName')
    assert.strictEqual(res2, 'csm from cache branchName-parentBranchName')
    assert.strictEqual(res3, 'csm not from cache branchName-parentBranchName')
  })

  it('_getAndSaveScmMergeBaseTime() works with VG runner', async function() {
    const [res1, res2, res3] = await Promise.all([
      eyesVG._getAndSaveScmMergeBaseTime('branchName', 'parentBranchName'),
      eyesVG2._getAndSaveScmMergeBaseTime('branchName', 'parentBranchName'),
      eyesVGOtherRunner._getAndSaveScmMergeBaseTime('branchName', 'parentBranchName'),
    ])
    assert.strictEqual(res1, 'csm not from cache branchName-parentBranchName')
    assert.strictEqual(res2, 'csm from cache branchName-parentBranchName')
    assert.strictEqual(res3, 'csm not from cache branchName-parentBranchName')
  })
})
