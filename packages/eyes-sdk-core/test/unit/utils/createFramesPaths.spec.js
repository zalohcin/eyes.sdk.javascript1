const createFramesPaths = require('../../../lib/utils/createFramesPaths')
const assert = require('assert')

describe('createFramesPaths', () => {
  it('should return an empty array when no cross frames exist', () => {
    const snapshot = {
      frames: [],
      crossFramesXPaths: [],
    }
    const result = createFramesPaths(snapshot)
    assert.deepStrictEqual(result, [])
  })

  it('should create frame paths for cross origin frames', () => {
    const snapshot = {
      frames: [],
      crossFramesXPaths: ['HTML[1]/BODY[1]'],
    }
    const result = createFramesPaths(snapshot)
    assert.deepStrictEqual(result, [
      {
        parentSnapshot: snapshot,
        path: ['HTML[1]/BODY[1]'],
      },
    ])
  })

  it('should create frame paths for frames that have cross origin frames', () => {
    const frameSnapshot = {
      frames: [],
      crossFramesXPaths: ['BODY[1]/IFRAME[1]'],
      selector: 'BODY[1]',
    }
    const snapshot = {
      frames: [frameSnapshot],
      crossFramesXPaths: [],
    }

    const result = createFramesPaths(snapshot)
    assert.deepStrictEqual(result, [
      {
        parentSnapshot: frameSnapshot,
        path: ['BODY[1]', 'BODY[1]/IFRAME[1]'],
      },
    ])
  })
})
