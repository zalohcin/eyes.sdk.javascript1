const createFramesPaths = require('../../../lib/utils/createFramesPaths')
const assert = require('assert')
const {Logger} = require('../../../')

const logger = new Logger(process.env.APPLITOOLS_SHOW_LOGS)

describe('createFramesPaths', () => {
  it('should return an empty array when no cross frames exist', () => {
    const snapshot = {
      frames: [],
      crossFramesXPaths: [],
    }
    const result = createFramesPaths({snapshot, logger})
    assert.deepStrictEqual(result, [])
  })

  it('should create frame paths for cross origin frames', () => {
    const snapshot = {
      frames: [],
      crossFramesXPaths: ['HTML[1]/BODY[1]'],
    }
    const result = createFramesPaths({snapshot, logger})
    assert.deepStrictEqual(result, [
      {
        parentSnapshot: {
          frames: [],
        },
        path: ['HTML[1]/BODY[1]'],
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
          crossFramesXPaths: ['BODY[1]/IFRAME[1]', 'BODY[1]/IFRAME[2]'],
          selector: 'BODY[1]',
        },
      ],
      crossFramesXPaths: [],
    }

    const result = createFramesPaths({snapshot, logger})
    assert.deepStrictEqual(result, [
      {
        parentSnapshot: {
          cdt: 'parent',
          frames: [],
        },
        path: ['BODY[1]', 'BODY[1]/IFRAME[1]'],
      },
      {
        parentSnapshot: {
          cdt: 'parent',
          frames: [],
        },
        path: ['BODY[1]', 'BODY[1]/IFRAME[2]'],
      },
    ])
  })
})
