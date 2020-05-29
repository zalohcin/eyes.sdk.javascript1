'use strict'
const {Target, Configuration, DeviceName} = require('../../../index')
const {getDriver, getEyes} = require('./util/TestSetup')

describe('TestRenderings', async () => {
  let browser, eyes

  beforeEach(async () => {
    browser = await getDriver('CHROME')
    eyes = getEyes('VG')
    eyes.setBranchName('master')
  })
  afterEach(async () => {
    await browser.deleteSession()
    await eyes.abortIfNotClosed()
  })

  it.skip('TestMobileOnly', async () => {
    let conf = new Configuration()
    conf.setTestName('Mobile Render Test')
    conf.setAppName('Visual Grid Render Test')
    conf.addDeviceEmulation(DeviceName.Galaxy_S5)
    conf.setViewportSize({width: 800, height: 600})
    eyes.setConfiguration(conf)
    await eyes.open(browser)
    await browser.url('https://applitools.github.io/demo/TestPages/DynamicResolution/mobile.html')
    await eyes.check('Test Mobile Only', Target.window().fully())
    await eyes.close()
    await eyes.getRunner().getAllTestResults()
  })
})
