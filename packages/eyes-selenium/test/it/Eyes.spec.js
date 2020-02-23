'use strict'

const assert = require('assert')
const {Eyes, ClassicRunner, VisualGridRunner} = require('../../index')

describe('Eyes', function() {
  let eyesClassic, eyesClassic2, eyesClassic3, eyesVG, eyesVG2, eyesVG3

  before(function() {
    const cr = new ClassicRunner()
    eyesClassic = new Eyes(cr)
    eyesClassic2 = new Eyes(cr)
    eyesClassic3 = new Eyes(cr)

    const vgr = new VisualGridRunner()
    eyesVG = new Eyes(vgr)
    eyesVG2 = new Eyes(vgr)
    eyesVG3 = new Eyes(vgr)

    const batchInfo = id => `batchInfo of ${id}`
    eyesClassic._runner._getBatchInfo = batchInfo
    eyesClassic2._runner._getBatchInfo = batchInfo
    eyesClassic3._runner._getBatchInfo = batchInfo
    eyesVG._runner._getBatchInfo = batchInfo
    eyesVG2._runner._getBatchInfo = batchInfo
    eyesVG3._runner._getBatchInfo = batchInfo
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
})
