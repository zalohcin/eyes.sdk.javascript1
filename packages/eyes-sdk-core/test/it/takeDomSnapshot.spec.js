const takeDomSnapshot = require('../../lib/utils/takeDomSnapshot')
const {expect} = require('chai')
const {Driver: FakeEyesDriver} = require('../utils/FakeSDK')
const MockDriver = require('../utils/MockDriver')
const Logger = require('../../lib/logging/Logger')
const {presult} = require('../../lib/utils/GeneralUtils')

const logger = new Logger(!!process.env.APPLITOOLS_SHOW_LOGS)

describe('takeDomSnapshot', () => {
  let driver, eyesDriver

  beforeEach(async () => {
    driver = new MockDriver()
    eyesDriver = await new FakeEyesDriver(logger, driver).init()
  })

  it('should throw an error if snapshot failed', async () => {
    driver.mockScript('dom-snapshot', function() {
      return JSON.stringify({status: 'ERROR', error: 'some error'})
    })
    const [error] = await presult(takeDomSnapshot({driver: eyesDriver, logger}))
    expect(error).not.to.be.undefined
    expect(error.message).to.equal('Unable to process dom snapshot: some error')
  })

  it('should throw an error if timeout is reached', async () => {
    driver.mockScript('dom-snapshot', function() {
      return JSON.stringify({status: 'WIP'})
    })
    const [error] = await presult(takeDomSnapshot({driver: eyesDriver, logger, startTime: 0})) // failing because startTime is the beginning of time
    expect(error).not.to.be.undefined
    expect(error.message).to.equal('Timeout is reached.')
  })

  it('should take a dom snapshot', async () => {
    driver.mockScript('dom-snapshot', function() {
      return generateSnapshotResponse({
        cdt: 'cdt',
        resourceUrls: 'resourceUrls',
        blobs: [],
        frames: [],
      })
    })
    const actualSnapshot = await takeDomSnapshot({driver: eyesDriver, logger})
    expect(actualSnapshot).to.eql({
      cdt: 'cdt',
      frames: [],
      resourceContents: {},
      resourceUrls: 'resourceUrls',
      frames: [],
      srcAttr: null,
      scriptVersion: 'mock value',
    })
  })

  it('should take a dom snapshot with cross origin frames', async () => {
    driver.mockScript('dom-snapshot', function() {
      return this.name === '[data-applitools-selector="123"]'
        ? generateSnapshotResponse({cdt: 'frame-cdt'})
        : generateSnapshotResponse({crossFramesSelectors: ['[data-applitools-selector="123"]']})
    })
    driver.mockElements([
      {
        selector: '[data-applitools-selector="123"]',
        frame: true,
        isCORS: true,
        attributes: [],
        children: [],
      },
    ])
    const snapshot = await takeDomSnapshot({driver: eyesDriver, logger})
    expect(snapshot).to.eql({
      cdt: [],
      resourceContents: {},
      resourceUrls: [],
      scriptVersion: 'mock value',
      srcAttr: null,
      frames: [
        {
          cdt: 'frame-cdt',
          frames: [],
          resourceContents: {},
          resourceUrls: [],
          scriptVersion: 'mock value',
          srcAttr: null,
        },
      ],
    })
  })

  it('should take a dom snapshot with nested cross origin frames', async () => {
    try {
      driver.mockElements([
        {
          selector: '[data-applitools-selector="123"]',
          frame: true,
          isCORS: true,
          attributes: [],
          children: [
            {
              selector: '[data-applitools-selector="456"]',
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
          case '[data-applitools-selector="123"]':
            return generateSnapshotResponse({
              cdt: 'frame',
              crossFramesSelectors: ['[data-applitools-selector="456"]'],
            })
          case '[data-applitools-selector="456"]':
            return generateSnapshotResponse({cdt: 'nested frame'})
          default:
            return generateSnapshotResponse({
              cdt: 'top page',
              crossFramesSelectors: ['[data-applitools-selector="123"]'],
            })
        }
      })

      const snapshot = await takeDomSnapshot({driver: eyesDriver, logger})
      expect(snapshot).to.eql({
        cdt: 'top page',
        frames: [
          {
            cdt: 'frame',
            frames: [
              {
                cdt: 'nested frame',
                frames: [],
                resourceContents: {},
                resourceUrls: [],
                scriptVersion: 'mock value',
                srcAttr: null,
              },
            ],
            resourceContents: {},
            resourceUrls: [],
            scriptVersion: 'mock value',
            srcAttr: null,
          },
        ],
        resourceContents: {},
        resourceUrls: [],
        scriptVersion: 'mock value',
        srcAttr: null,
      })
    } catch (error) {
      throw error
    }
  })

  it('should take a dom snapshot with nested frames containing cross origin frames', async () => {
    driver.mockElements([
      {
        selector: '[data-applitools-selector="123"]',
        frame: true,
        attributes: [],
        children: [
          {
            selector: '[data-applitools-selector="456"]',
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
        case '[data-applitools-selector="456"]':
          return generateSnapshotResponse({
            cdt: 'nested frame',
            selector: '[data-applitools-selector="456"]',
          })
        default:
          return generateSnapshotResponse({
            cdt: 'top page',
            frames: [
              generateSnapshotObject({
                cdt: 'frame',
                selector: '[data-applitools-selector="123"]',
                crossFramesSelectors: ['[data-applitools-selector="456"]'],
              }),
            ],
          })
      }
    })

    const snapshot = await takeDomSnapshot({driver: eyesDriver, logger})
    expect(snapshot).to.eql({
      cdt: 'top page',
      frames: [
        {
          cdt: 'frame',
          frames: [
            {
              cdt: 'nested frame',
              frames: [],
              resourceContents: {},
              resourceUrls: [],
              scriptVersion: 'mock value',
              srcAttr: null,
            },
          ],
          resourceContents: {},
          resourceUrls: [],
          scriptVersion: 'mock value',
          srcAttr: null,
        },
      ],
      resourceContents: {},
      resourceUrls: [],
      scriptVersion: 'mock value',
      srcAttr: null,
    })
  })
})

function generateSnapshotResponse(overrides) {
  return JSON.stringify({status: 'SUCCESS', value: generateSnapshotObject(overrides)})
}

function generateSnapshotObject(overrides) {
  return {
    cdt: [],
    srcAttr: null,
    resourceUrls: [],
    blobs: [],
    frames: [],
    crossFramesSelectors: undefined,
    scriptVersion: 'mock value',
    ...overrides,
  }
}
