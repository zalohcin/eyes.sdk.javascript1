const takeDomSnapshot = require('../../lib/utils/takeDomSnapshot')
const {expect} = require('chai')
const {Driver: FakeEyesDriver} = require('../utils/FakeSDK')
const MockDriver = require('../utils/MockDriver')
const Logger = require('../../lib/logging/Logger')

const logger = new Logger(!!process.env.APPLITOOLS_SHOW_LOGS)

describe('takeDomSnapshot', () => {
  let driver, eyesDriver, topPageSnapshot, innerFrameSnapshot, expectedSnapshot

  const generateSnapshotObject = xpath => {
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
    return JSON.stringify({status: 'SUCCESS', value})
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

  it('should take a dom snapshot with cross origin iframes', async () => {
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

  it('should take a dom snapshot with nested cross origin iframes', async () => {
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
})
