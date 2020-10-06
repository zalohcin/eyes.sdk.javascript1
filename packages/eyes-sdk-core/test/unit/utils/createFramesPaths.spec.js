const createFramesPaths = require('../../../lib/utils/createFramesPaths')
const assert = require('assert')
const {Logger} = require('../../../')

const logger = new Logger(process.env.APPLITOOLS_SHOW_LOGS)

describe('createFramesPaths', () => {
  it('should return an empty array when no cross frames exist', () => {
    const snapshot = {
      frames: [],
      crossFramesSelectors: [],
    }
    const result = createFramesPaths({snapshot, logger})
    assert.deepStrictEqual(result, [])
  })

  it('should create frame paths for cross origin frames', () => {
    const snapshot = {
      frames: [],
      crossFramesSelectors: ['selector1'],
    }
    const result = createFramesPaths({snapshot, logger})
    assert.deepStrictEqual(result, [
      {
        parentSnapshot: {
          frames: [],
        },
        path: ['selector1'],
      },
    ])
  })

  it('should create frame paths for frames that have cross origin frames', () => {
    const snapshot = {
      cdt: 'top',
      frames: [
        {
          cdt: 'parent',
          frames: [],
          crossFramesSelectors: ['selector1', 'selector2'],
          selector: 'selector0',
        },
      ],
      crossFramesSelectors: [],
    }

    const result = createFramesPaths({snapshot, logger})
    assert.deepStrictEqual(result, [
      {
        parentSnapshot: {
          cdt: 'parent',
          frames: [],
        },
        path: ['selector0', 'selector1'],
      },
      {
        parentSnapshot: {
          cdt: 'parent',
          frames: [],
        },
        path: ['selector0', 'selector2'],
      },
    ])
  })
})
