'use strict'

const uaParser = require('ua-parser-js')
const fetch = require('node-fetch')
const {describe, it, before} = require('mocha')
const {expect} = require('chai')
const makeRenderer = require('../../src/sdk/renderer')
const createRenderRequests = require('../../src/sdk/createRenderRequests')
const {RenderingInfo} = require('@applitools/eyes-sdk-core')

describe('render e2e', () => {
  let renderingInfo
  const apiKey = process.env.APPLITOOLS_API_KEY
  before(async () => {
    renderingInfo = await fetch(
      `https://eyesapi.applitools.com/api/sessions/renderInfo?apiKey=${apiKey}`,
    )
      .then(r => r.json())
      .then(json => new RenderingInfo(json))
  })

  it('renders older browser versions', async () => {
    const browsers = [
      {width: 640, height: 480, name: 'chrome'},
      {width: 640, height: 480, name: 'chrome-1'},
      {width: 640, height: 480, name: 'chrome-2'},
      {width: 640, height: 480, name: 'firefox'},
      {width: 640, height: 480, name: 'firefox-1'},
      {width: 640, height: 480, name: 'firefox-2'},
      {width: 640, height: 480, name: 'safari'},
      // {width: 640, height: 480, name: 'safari-1'}, // waiting for implementation in VG
      // {width: 640, height: 480, name: 'safari-2'},
    ]

    const {createRGridDOMAndGetResourceMapping, renderBatch, waitForRenderedStatus} = makeRenderer({
      apiKey,
      showLogs: process.env.APPLITOOLS_SHOW_LOGS,
      renderingInfo,
    })

    const {rGridDom: dom, allResources: _} = await createRGridDOMAndGetResourceMapping({
      resourceUrls: [],
      resourceContents: [],
      cdt: [{nodeType: 3, nodeValue: 'renders older browser versions - works!'}],
      frames: [],
    })

    const renderRequests = createRenderRequests({
      url: 'http://something',
      dom,
      resources: [],
      browsers,
      renderInfo: renderingInfo,
      sizeMode: 'full-page',
    })

    const renderIds = await renderBatch(renderRequests)

    const renderStatusResults = await Promise.all(
      renderIds.map(renderId => waitForRenderedStatus(renderId)),
    )

    const majorVersions = renderStatusResults.map(({userAgent}) =>
      Number(uaParser(userAgent).browser.major),
    )

    expect(majorVersions[1]).to.equal(majorVersions[0] - 1) // chrome-1
    expect(majorVersions[2]).to.equal(majorVersions[0] - 2) // chrome-2
    expect(majorVersions[4]).to.equal(majorVersions[3] - 1) // firefox-1
    expect(majorVersions[5]).to.equal(majorVersions[3] - 2) // firefox-2
    // expect(majorVersions[5]).to.equal(majorVersions[3] - 2) // safari-1
    // expect(majorVersions[5]).to.equal(majorVersions[3] - 2) // safari-2
  })
})
