'use strict'
const cwd = process.cwd()
const path = require('path')
const spec = require(path.resolve(cwd, 'src/SpecDriver'))
const {getEyes} = require('../../src/test-setup')
const {Target, BrowserType} = require(cwd)
const appName = 'Special Characters Test'
describe(appName, () => {
  let webDriver, eyes
  beforeEach(async () => {
    webDriver = await spec.build({browser: 'chrome'})
    eyes = await getEyes({isVisualGrid: true})
  })
  afterEach(async () => {
    await eyes.abortIfNotClosed()
    await spec.cleanup(webDriver)
  })

  it('TestRenderSpecialCharacters', async () => {
    let conf = eyes.getConfiguration()
    conf.setTestName('Special Characters')
    conf.setAppName(appName)
    conf.addBrowser(800, 600, BrowserType.CHROME)
    conf.setBranchName('default')
    eyes.setConfiguration(conf)
    await eyes.open(webDriver)
    await spec.visit(
      webDriver,
      'https://applitools.github.io/demo/TestPages/SpecialCharacters/index.html',
    )
    await eyes.check('Test Special Characters', Target.window().fully())
    await eyes.close()
    await eyes.getRunner().getAllTestResults()
  })
})
