const takeDomSnapshot = require('../../lib/utils/takeDomSnapshot')
const {expect} = require('chai')
const {Driver: FakeEyesDriver} = require('../utils/FakeSDK')
const MockDriver = require('../utils/MockDriver')
const Logger = require('../../lib/logging/Logger')

const logger = new Logger(!!process.env.APPLITOOLS_SHOW_LOGS)

describe('takeDomSnapshot', () => {
  let driver, eyesDriver, topPageSnapshot, innerFrameSnapshot, expectedSnapshot

  const generateSnapshotObject = (xpath, status = 'SUCCESS', state = {}) => {
    const crossFrameSelector = xpath ? [xpath] : []
    const value = {
      cdt: [],
      srcAttr: null,
      resourceUrls: [],
      resourceContents: {},
      blobs: [],
      frames: [],
      crossFramesXPaths: crossFrameSelector,
      scriptVersion: '4.0.6',
    }
    return JSON.stringify({status, value, ...state})
  }

  beforeEach(async () => {
    driver = new MockDriver()
    topPageSnapshot = generateSnapshotObject('HTML[1]/BODY[1]/IFRAME[1]')
    innerFrameSnapshot = generateSnapshotObject()
    driver.mockScript('dom-snapshot', function() {
      return this.name === 'HTML[1]/BODY[1]/IFRAME[1]' ? innerFrameSnapshot : topPageSnapshot
    })

    eyesDriver = new FakeEyesDriver(logger, driver)
  })

  beforeEach(() => {
    expectedSnapshot = {...JSON.parse(topPageSnapshot).value}
    expectedSnapshot.frames.push({...JSON.parse(innerFrameSnapshot).value})
    delete expectedSnapshot.crossFramesXPaths
    delete expectedSnapshot.blobs
    delete expectedSnapshot.frames[0].crossFramesXPaths
    delete expectedSnapshot.frames[0].blobs
  })

  it('should throw an error if snapshot failed', async () => {
    try {
      topPageSnapshot = generateSnapshotObject(null, 'ERROR', {error: 'some error'})
      await takeDomSnapshot({driver: eyesDriver})
    } catch (error) {
      expect(error.message).to.equal('Unable to process dom snapshot: some error')
    }
  })

  it('should throw an error if timeout is reached', async () => {
    try {
      topPageSnapshot = generateSnapshotObject(null)
      await takeDomSnapshot({driver: eyesDriver, startTime: 1600150463048})
    } catch (error) {
      expect(error.message).to.equal('Timeout is reached.')
    }
  })

  it('should take a dom snapshot', async () => {
    try {
      driver.mockScript('dom-snapshot', function() {
        const snap = JSON.parse(topPageSnapshot)
        snap.value.crossFramesXPaths.pop()
        return JSON.stringify(snap)
      })
      const snapshot = await takeDomSnapshot({driver: eyesDriver})
      expect(snapshot.frames.length).to.eql(0)
    } catch (error) {
      throw error
    }
  })

  it('should take a dom snapshot with cross origin frames', async () => {
    try {
      driver.mockElements([
        {
          selector: 'HTML[1]/BODY[1]/IFRAME[1]',
          frame: true,
          isCORS: true,
          attributes: [],
          children: [],
        },
      ])
      const snapshot = await takeDomSnapshot({driver: eyesDriver})
      expect(snapshot.frames.length).to.eql(1)
      expect(snapshot).to.eql(expectedSnapshot)
    } catch (error) {
      throw error
    }
  })

  it('should take a dom snapshot with nested cross origin frames', async () => {
    try {
      const deeplyNestedFrameSnapshot = generateSnapshotObject('BODY[1]/IFRAME[1]')
      driver.mockElements([
        {
          selector: 'HTML[1]/BODY[1]/IFRAME[1]',
          frame: true,
          isCORS: true,
          attributes: [],
          children: [
            {
              selector: 'BODY[1]/IFRAME[1]',
              frame: true,
              isCORS: true,
              attributes: [],
              children: [],
            },
          ],
        },
      ])

      driver.mockScript('dom-snapshot', function() {
        switch (this.name) {
          case 'HTML[1]/BODY[1]/IFRAME[1]':
            return innerFrameSnapshot
          case 'BODY[1]/IFRAME[1]':
            return deeplyNestedFrameSnapshot
          default:
            return topPageSnapshot
        }
      })

      const snapshot = await takeDomSnapshot({driver: eyesDriver})
      expect(snapshot).to.eql(expectedSnapshot)
    } catch (error) {
      throw error
    }
  })

  it('should take a dom snapshot with nested frames containing cross origin frames', async () => {
    try {
      driver.mockElements([
        {
          selector: 'DIV[1]/IFRAME[1]',
          frame: true,
          attributes: [],
          children: [
            {
              selector: 'DIV[1]/SPAN[1]/DIV[1]/IFRAME[1]',
              frame: true,
              isCORS: true,
              attributes: [],
              children: [],
            },
          ],
        },
      ])
      const wrapperFrame = {
        cdt: [],
        srcAttr: null,
        resourceUrls: [],
        resourceContents: {},
        blobs: [],
        frames: [],
        selector: 'DIV[1]/IFRAME[1]',
        crossFramesXPaths: ['DIV[1]/SPAN[1]/DIV[1]/IFRAME[1]'],
        scriptVersion: '4.0.6',
      }
      const topLevelSnapshot = JSON.stringify({
        status: 'SUCCESS',
        value: {
          cdt: [],
          srcAttr: null,
          resourceUrls: [],
          resourceContents: {},
          selector: '',
          blobs: [],
          frames: [
            {
              ...wrapperFrame,
            },
          ],
          crossFramesXPaths: [],
          scriptVersion: '4.0.6',
        },
      })

      const deeplyNestedFrameSnapshot = JSON.stringify({
        status: 'SUCCESS',
        value: {
          cdt: [],
          srcAttr: null,
          resourceUrls: [],
          resourceContents: {},
          blobs: [],
          frames: [],
          crossFramesXPaths: [],
          selector: 'DIV[1]/SPAN[1]/DIV[1]/IFRAME[1]',
          scriptVersion: '4.0.6',
        },
      })

      driver.mockScript('dom-snapshot', function() {
        switch (this.name) {
          case 'DIV[1]/SPAN[1]/DIV[1]/IFRAME[1]':
            return deeplyNestedFrameSnapshot
          default:
            return topLevelSnapshot
        }
      })

      const snapshot = await takeDomSnapshot({driver: eyesDriver})
      delete wrapperFrame.selector
      delete wrapperFrame.crossFramesXPaths
      delete wrapperFrame.blobs
      expect(snapshot.frames[0].frames[0]).to.eql(wrapperFrame)
    } catch (error) {
      throw error
    }
  })
})
