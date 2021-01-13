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
    const [error] = await presult(takeDomSnapshot(logger, eyesDriver))
    expect(error).not.to.be.undefined
    expect(error.message).to.equal("Error during execute poll script: 'some error'")
  })

  it('should throw an error if timeout is reached', async () => {
    driver.mockScript('dom-snapshot', function() {
      return JSON.stringify({status: 'WIP'})
    })
    const [error] = await presult(takeDomSnapshot(logger, eyesDriver, {executionTimeout: 0}))
    expect(error).not.to.be.undefined
    expect(error.message).to.equal('Poll script execution is timed out')
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
    const actualSnapshot = await takeDomSnapshot(logger, eyesDriver)
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
    driver.mockElements([
      {
        selector: '[data-applitools-selector="123"]',
        frame: true,
      },
    ])
    driver.mockScript('dom-snapshot', function() {
      return this.name === '[data-applitools-selector="123"]'
        ? generateSnapshotResponse({cdt: 'frame-cdt', url: 'http://cors.com'})
        : generateSnapshotResponse({
            cdt: [{nodeName: 'IFRAME', attributes: []}],
            crossFrames: [{selector: '[data-applitools-selector="123"]', index: 0}],
          })
    })
    const snapshot = await takeDomSnapshot(logger, eyesDriver)
    derandomizeUrls(snapshot)
    expect(snapshot).to.eql({
      cdt: [
        {
          nodeName: 'IFRAME',
          attributes: [
            {name: 'data-applitools-src', value: 'http://cors.com/?applitools-iframe=0'},
          ],
        },
      ],
      resourceContents: {},
      resourceUrls: [],
      scriptVersion: 'mock value',
      srcAttr: null,
      frames: [
        {
          cdt: 'frame-cdt',
          frames: [],
          url: 'http://cors.com/?applitools-iframe=0',
          resourceContents: {},
          resourceUrls: [],
          scriptVersion: 'mock value',
          srcAttr: null,
        },
      ],
    })
  })

  it('should take a dom snapshot with cross origin frames with the same src attr', async () => {
    driver.mockElements([
      {
        selector: '[data-applitools-selector="123"]',
        frame: true,
      },
      {
        selector: '[data-applitools-selector="456"]',
        frame: true,
      },
    ])
    driver.mockScript('dom-snapshot', function() {
      switch (this.name) {
        case '[data-applitools-selector="123"]':
          return generateSnapshotResponse({
            cdt: 'frame-cdt',
            url: 'http://cors.com',
          })
        case '[data-applitools-selector="456"]':
          return generateSnapshotResponse({
            cdt: 'another-frame-cdt',
            url: 'http://cors.com',
          })
        default:
          return generateSnapshotResponse({
            cdt: [
              {nodeName: 'IFRAME', attributes: []},
              {nodeName: 'IFRAME', attributes: []},
            ],
            crossFrames: [
              {selector: '[data-applitools-selector="123"]', index: 0},
              {selector: '[data-applitools-selector="456"]', index: 1},
            ],
          })
      }
    })
    const snapshot = await takeDomSnapshot(logger, eyesDriver)
    derandomizeUrls(snapshot)
    expect(snapshot).to.eql({
      cdt: [
        {
          nodeName: 'IFRAME',
          attributes: [
            {name: 'data-applitools-src', value: 'http://cors.com/?applitools-iframe=0'},
          ],
        },
        {
          nodeName: 'IFRAME',
          attributes: [
            {name: 'data-applitools-src', value: 'http://cors.com/?applitools-iframe=0'},
          ],
        },
      ],
      resourceContents: {},
      resourceUrls: [],
      scriptVersion: 'mock value',
      srcAttr: null,
      frames: [
        {
          cdt: 'frame-cdt',
          frames: [],
          url: 'http://cors.com/?applitools-iframe=0',
          resourceContents: {},
          resourceUrls: [],
          scriptVersion: 'mock value',
          srcAttr: null,
        },
        {
          cdt: 'another-frame-cdt',
          frames: [],
          url: 'http://cors.com/?applitools-iframe=1',
          resourceContents: {},
          resourceUrls: [],
          scriptVersion: 'mock value',
          srcAttr: null,
        },
      ],
    })
  })

  it('should take a dom snapshot with nested cross origin frames', async () => {
    driver.mockElements([
      {
        selector: '[data-applitools-selector="123"]',
        frame: true,
        children: [
          {
            selector: '[data-applitools-selector="456"]',
            frame: true,
          },
        ],
      },
    ])

    driver.mockScript('dom-snapshot', function() {
      switch (this.name) {
        case '[data-applitools-selector="123"]':
          return generateSnapshotResponse({
            cdt: [{nodeName: 'IFRAME', attributes: []}],
            url: 'http://cors.com',
            crossFrames: [{selector: '[data-applitools-selector="456"]', index: 0}],
          })
        case '[data-applitools-selector="456"]':
          return generateSnapshotResponse({
            cdt: 'nested frame',
            url: 'http://cors-2.com',
          })
        default:
          return generateSnapshotResponse({
            cdt: [{nodeName: 'IFRAME', attributes: []}],
            crossFrames: [{selector: '[data-applitools-selector="123"]', index: 0}],
          })
      }
    })

    const snapshot = await takeDomSnapshot(logger, eyesDriver)
    derandomizeUrls(snapshot)
    expect(snapshot).to.eql({
      cdt: [
        {
          nodeName: 'IFRAME',
          attributes: [
            {name: 'data-applitools-src', value: 'http://cors.com/?applitools-iframe=0'},
          ],
        },
      ],
      frames: [
        {
          cdt: [
            {
              nodeName: 'IFRAME',
              attributes: [
                {name: 'data-applitools-src', value: 'http://cors-2.com/?applitools-iframe=0'},
              ],
            },
          ],
          frames: [
            {
              cdt: 'nested frame',
              frames: [],
              url: 'http://cors-2.com/?applitools-iframe=0',
              resourceContents: {},
              resourceUrls: [],
              scriptVersion: 'mock value',
              srcAttr: null,
            },
          ],
          url: 'http://cors.com/?applitools-iframe=0',
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

  it('should take a dom snapshot with nested frames containing cross origin frames', async () => {
    driver.mockElements([
      {
        selector: '[data-applitools-selector="123"]',
        frame: true,
        children: [
          {
            selector: '[data-applitools-selector="456"]',
            frame: true,
          },
        ],
      },
    ])

    driver.mockScript('dom-snapshot', function() {
      switch (this.name) {
        case '[data-applitools-selector="456"]':
          return generateSnapshotResponse({
            cdt: 'nested frame',
            url: 'http://cors.com',
            selector: '[data-applitools-selector="456"]',
          })
        default:
          return generateSnapshotResponse({
            cdt: 'top page',
            frames: [
              generateSnapshotObject({
                cdt: [{nodeName: 'IFRAME', attributes: []}],
                selector: '[data-applitools-selector="123"]',
                crossFrames: [{selector: '[data-applitools-selector="456"]', index: 0}],
              }),
            ],
          })
      }
    })

    const snapshot = await takeDomSnapshot(logger, eyesDriver)
    derandomizeUrls(snapshot)
    expect(snapshot).to.eql({
      cdt: 'top page',
      frames: [
        {
          cdt: [
            {
              nodeName: 'IFRAME',
              attributes: [
                {name: 'data-applitools-src', value: 'http://cors.com/?applitools-iframe=0'},
              ],
            },
          ],
          frames: [
            {
              cdt: 'nested frame',
              url: 'http://cors.com/?applitools-iframe=0',
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

  it('should handle failure to switch to frame', async () => {
    driver.mockElements([
      {
        selector: '[data-applitools-selector="123"]',
      },
    ])
    driver.mockScript('dom-snapshot', function() {
      return generateSnapshotResponse({
        cdt: 'top frame',
        crossFrames: [{selector: '[data-applitools-selector="123"]', index: 0}],
      })
    })

    const snapshot = await takeDomSnapshot(logger, eyesDriver)
    expect(snapshot.frames).to.deep.equal([])
  })

  it('should handle failure to switch to nested frame', async () => {
    driver.mockElements([
      {
        selector: '[data-applitools-selector="123"]',
        frame: true,
        isCORS: true,
        children: [
          {
            selector: '[data-applitools-selector="456"]',
          },
        ],
      },
    ])
    driver.mockScript('dom-snapshot', function() {
      switch (this.name) {
        case '[data-applitools-selector="123"]':
          return generateSnapshotResponse({
            cdt: 'inner parent frame',
            crossFrames: [
              {selector: '[data-applitools-selector="456"]', index: 0, url: 'https://cors.com'},
            ],
          })
        default:
          return generateSnapshotResponse({
            cdt: [{nodeName: 'IFRAME', attributes: [], value: 'https://cors.com'}],
            crossFrames: [
              {selector: '[data-applitools-selector="123"]', index: 0, url: 'https://cors.com'},
            ],
          })
      }
    })

    const snapshot = await takeDomSnapshot(logger, eyesDriver)
    expect(snapshot.frames).to.deep.equal([
      {
        cdt: 'inner parent frame',
        resourceContents: {},
        resourceUrls: [],
        frames: [],
        scriptVersion: 'mock value',
        srcAttr: null,
      },
    ])
  })

  it('should add data-applitools-src to the cors frame cdt node', async () => {
    driver.mockElements([
      {
        name: 'cors-frame',
        selector: '[data-applitools-selector="1"]',
        frame: true,
        isCORS: true,
      },
    ])
    driver.mockScript('dom-snapshot', function() {
      switch (this.name) {
        case 'cors-frame':
          return generateSnapshotResponse({
            cdt: 'cors frame',
            url: 'http://cors.com',
          })
        default:
          return generateSnapshotResponse({
            cdt: [{nodeName: 'IFRAME', attributes: []}],
            crossFrames: [{selector: '[data-applitools-selector="1"]', index: 0}],
          })
      }
    })

    const {cdt} = await takeDomSnapshot(logger, eyesDriver)
    derandomizeUrls({cdt})
    expect(cdt).to.deep.equal([
      {
        nodeName: 'IFRAME',
        attributes: [{name: 'data-applitools-src', value: 'http://cors.com/?applitools-iframe=0'}],
      },
    ])
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
    crossFrames: undefined,
    scriptVersion: 'mock value',
    ...overrides,
  }
}
// TODO move to sdk-shared
function derandomize(subjects, name, prop, counter = 0) {
  for (const subject of subjects) {
    if (subject[name]) {
      derandomize(subject[name], name, prop, counter)
    }
    if (subject[prop] && subject[prop].includes('?applitools-iframe')) {
      const randomNumber = subject[prop].match(/[^?=]*$/)[0]
      subject[prop] = subject[prop].replace(randomNumber, counter++)
    }
  }
}

function derandomizeUrls(snapshot) {
  if (snapshot.frames) {
    derandomize(snapshot.frames, 'frames', 'url')
    Array.isArray(snapshot.frames) &&
      snapshot.frames.forEach(frame => frame.cdt && derandomize(frame.cdt, 'attributes', 'value'))
  }

  if (snapshot.cdt) {
    derandomize(snapshot.cdt, 'attributes', 'value')
    Array.isArray(snapshot.cdt) &&
      snapshot.cdt.forEach(cdt => cdt.frames && derandomize(cdt.frames, 'frames', 'url'))
  }
}
