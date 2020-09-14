const takeDomSnapshot = require('../../lib/utils/takeDomSnapshot')
const {expect} = require('chai')
const {Driver: FakeEyesDriver} = require('../utils/FakeSDK')
const MockDriver = require('../utils/MockDriver')
const Logger = require('../../lib/logging/Logger')

const logger = new Logger(!!process.env.APPLITOOLS_SHOW_LOGS)

describe('takeDomSnapshot', () => {
  let driver, eyesDriver
  before(async () => {
    driver = new MockDriver()
    const element = driver.mockElement('HTML[1]/BODY[1]/IFRAME[1]', {
      selector: 'HTML[1]/BODY[1]/IFRAME[1]',
      frame: true,
      isCORS: true,
      attributes: [
        {
          name: 'src',
          value: 'http://localhost:7374/iframes/frame.html',
        },
        {
          name: 'style',
          value: 'display: flex; width: 100%; height: 100%; flex-direction: column;',
        },
      ],
      children: [],
    })
    const frameSnapshot = JSON.stringify({
      status: 'SUCCESS',
      value: {
        url: 'http://localhost:7373/cors.html',
        srcAttr: null,
        resourceUrls: [],
        blobs: [],
        frames: [],
        crossFramesXPaths: [],
        scriptVersion: '4.0.6',
      },
    })
    const topPageSnapshot = JSON.stringify({
      status: 'SUCCESS',
      value: {
        cdt: [
          {
            nodeType: 9,
            childNodeIndexes: [4],
          },
          {
            nodeType: 1,
            nodeName: 'HEAD',
            attributes: [],
            childNodeIndexes: [],
          },
          {
            nodeType: 1,
            nodeName: 'IFRAME',
            attributes: [
              {
                name: 'src',
                value: 'http://localhost:7374/iframes/frame.html',
              },
              {
                name: 'style',
                value: 'display: flex; width: 100%; height: 100%; flex-direction: column;',
              },
            ],
            childNodeIndexes: [],
          },
          {
            nodeType: 1,
            nodeName: 'BODY',
            attributes: [],
            childNodeIndexes: [2],
          },
          {
            nodeType: 1,
            nodeName: 'HTML',
            attributes: [],
            childNodeIndexes: [1, 3],
          },
        ],
        url: 'http://localhost:7373/cors.html',
        srcAttr: null,
        resourceUrls: [],
        blobs: [],
        frames: [],
        crossFramesXPaths: ['HTML[1]/BODY[1]/IFRAME[1]'],
        scriptVersion: '4.0.6',
      },
    })

    driver.mockScript(MockDriver.DOM_SNAPSHOT_REGEX, () =>
      driver.contextId === element.contextId ? frameSnapshot : topPageSnapshot,
    )
    eyesDriver = new FakeEyesDriver(logger, driver)
  })

  it('should take a dom snapshot with frames', async () => {
    try {
      const snapshot = await takeDomSnapshot({driver: eyesDriver})
      console.log(snapshot)
      expect(snapshot.frames.length).to.eql(1)
    } catch (error) {
      throw error
    }
  })
})
