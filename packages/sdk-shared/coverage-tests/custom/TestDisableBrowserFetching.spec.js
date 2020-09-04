'use strict'

const path = require('path')
const cwd = process.cwd()
const startTestServer = require('../../src/test-server')
const {Target} = require(cwd)
const spec = require(path.resolve(cwd, 'src/SpecDriver'))
const {getEyes} = require('../../src/test-setup')
const preprocessUrl = require('../util/url-preprocessor')

// NOTE: works when run by itself but fails when running concurrently with all tests
describe.skip('TestDisableBrowserFetching', () => {
  let testServer
  let driver

  before(async () => {
    const staticPath = path.join(__dirname, '../fixtures')
    testServer = await startTestServer({
      port: 5557,
      staticPath,
      middlewareFile: path.resolve(__dirname, '../util/ua-middleware'),
    })
  })

  after(async () => {
    await testServer.close()
  })

  beforeEach(async () => {
    driver = await spec.build({browser: 'chrome'})
  })

  afterEach(async () => {
    await spec.cleanup(driver)
  })

  it('sends dontFetchResources to dom snapshot', async () => {
    const url = preprocessUrl('http://localhost:5557/ua.html')
    await spec.visit(driver, url)
    const eyes = getEyes({isVisualGrid: true, configuration: {disableBrowserFetching: true}})
    await eyes.open(driver, 'VgFetch', 'TestDisableBrowserFetching', {width: 800, height: 600})
    await eyes.check(Target.window())
    await eyes.close()
  })
})
