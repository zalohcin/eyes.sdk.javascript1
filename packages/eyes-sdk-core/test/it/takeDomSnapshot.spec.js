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
    const [error] = await presult(takeDomSnapshot({driver: eyesDriver}))
    expect(error).not.to.be.undefined
    expect(error.message).to.equal('Unable to process dom snapshot: some error')
  })

  it('should throw an error if timeout is reached', async () => {
    driver.mockScript('dom-snapshot', function() {
      return JSON.stringify({status: 'WIP'})
    })
    const [error] = await presult(takeDomSnapshot({driver: eyesDriver, startTime: 0})) // failing because startTime is the beginning of time
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
    const actualSnapshot = await takeDomSnapshot({driver: eyesDriver})
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
      return this.name === 'HTML[1]/BODY[1]/IFRAME[1]'
        ? generateSnapshotResponse({cdt: 'frame-cdt'})
        : generateSnapshotResponse({crossFramesXPaths: ['HTML[1]/BODY[1]/IFRAME[1]']})
    })
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
            return generateSnapshotResponse({
              cdt: 'frame',
              crossFramesXPaths: ['BODY[1]/IFRAME[1]'],
            })
          case 'BODY[1]/IFRAME[1]':
            return generateSnapshotResponse({cdt: 'nested frame'})
          default:
            return generateSnapshotResponse({
              cdt: 'top page',
              crossFramesXPaths: ['HTML[1]/BODY[1]/IFRAME[1]'],
            })
        }
      })

      const snapshot = await takeDomSnapshot({driver: eyesDriver})
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

    driver.mockScript('dom-snapshot', function() {
      switch (this.name) {
        case 'DIV[1]/SPAN[1]/DIV[1]/IFRAME[1]':
          return generateSnapshotResponse({
            cdt: 'nested frame',
            selector: 'DIV[1]/SPAN[1]/DIV[1]/IFRAME[1]',
          })
        default:
          return generateSnapshotResponse({
            cdt: 'top page',
            frames: [
              generateSnapshotObject({
                cdt: 'frame',
                selector: 'DIV[1]/IFRAME[1]',
                crossFramesXPaths: ['DIV[1]/SPAN[1]/DIV[1]/IFRAME[1]'],
              }),
            ],
          })
      }
    })

    const snapshot = await takeDomSnapshot({driver: eyesDriver})
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
    crossFramesXPaths: undefined,
    scriptVersion: 'mock value',
    ...overrides,
  }
}
