const createFramesPaths = require('../../../lib/utils/createFramesPaths')
const assert = require('assert')

describe('createFramesPaths', () => {
  it('should return an empty array when no cross frames exist', () => {
    const snapshot = generateSnapshot()
    const result = createFramesPaths(snapshot)
    assert.strictEqual(result.length, 0)
  })

  it('should create a frame path map', () => {
    const snapshot = generateSnapshot(['HTML[1]/BODY[1]'])
    const result = createFramesPaths(snapshot)
    assert.deepStrictEqual(result[0], {
      parentSnapshot: {
        cdt: [],
        srcAttr: null,
        resourceUrls: [],
        blobs: [],
        frames: [],
        scriptVersion: 'mock script',
      },
      path: ['HTML[1]/BODY[1]'],
    })
  })

  function generateSnapshot(crossFramesXPaths = []) {
    return {
      cdt: [],
      srcAttr: null,
      resourceUrls: [],
      blobs: [],
      frames: [],
      crossFramesXPaths,
      scriptVersion: 'mock script',
    }
  }
})
