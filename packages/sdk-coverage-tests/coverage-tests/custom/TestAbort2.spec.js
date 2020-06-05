'use strict'
const cwd = process.cwd()
const path = require('path')
const {getEyes, Browsers} = require('../util/TestSetup')
const {Target, BrowserType, RectangleSize} = require(cwd)
const spec = require(path.resolve(cwd, 'src/SpecWrappedDriver'))
const appName = 'Test abort'

describe(appName, () => {
  let webDriver, eyes

  beforeEach(async () => {
    webDriver = await spec.build({capabilities: Browsers.chrome()})
    await spec.visit(webDriver, 'data:text/html,<p>Test</p>')
  })

  afterEach(async () => {
    await spec.cleanup(webDriver)
  })

  describe(`Classic`, () => {
    beforeEach(async () => {
      eyes = getEyes()
      let config = eyes.getConfiguration()
      config.addBrowser(800, 600, BrowserType.CHROME)
      eyes.setConfiguration(config)
      await eyes.open(webDriver, 'Test Abort', 'Test Abort', new RectangleSize(1200, 800))
    })

    it(`TestAbortIfNotClosed`, async () => {
      await eyes.check('SEL', Target.window())
      spec.sleep(webDriver, 15000)
      await eyes.abort()
    })
  })

  describe(`VG`, () => {
    beforeEach(async () => {
      eyes = getEyes({isVisualGrid: true})
      let config = eyes.getConfiguration()
      config.addBrowser(800, 600, BrowserType.CHROME)
      eyes.setConfiguration(config)
      await eyes.open(webDriver, 'Test Abort_VG', 'Test Abort_VG', new RectangleSize(1200, 800))
    })

    it(`TestAbortIfNotClosed`, async () => {
      await eyes.check('VG', Target.window())
      spec.sleep(webDriver, 15000)
      await eyes.abort()
    })
  })
})
