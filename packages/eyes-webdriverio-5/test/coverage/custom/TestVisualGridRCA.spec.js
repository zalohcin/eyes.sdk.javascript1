'use strict'
const {getDriver, getEyes} = require('./util/TestSetup')
const {Target} = require('../../../index')
const appName = 'TestRendersMatch'
describe.skip(appName, async () => {
  let browser, eyes
  beforeEach(async () => {
    browser = await getDriver('CHROME')
    eyes = await getEyes('VG')
  })

  afterEach(async () => {
    await browser.deleteSession()
    await eyes.abortIfNotClosed()
  })

  it('Test_VG_RCA_Config', async () => {
    await browser.url('https://applitools.github.io/demo/TestPages/VisualGridTestPage')
    await eyes.open(browser, 'Test Visual Grid', 'Test RCA Config')
    eyes.sendDom = true
    await eyes.check('check', Target.window())
    await eyes.close()
    await eyes.getRunner().getAllTestResults()
  })

  it('Test_VG_RCA_Fluent', async () => {
    await browser.url('https://applitools.github.io/demo/TestPages/VisualGridTestPage')
    let frame = await browser.$('#iframe')
    await browser.switchToFrame(frame)
    let element = await browser.$('#p2')
    await element.waitForDisplayed(20000)
    await browser.switchToFrame(null)
    eyes.sendDom = false
    await eyes.open(browser, 'Test Visual Grid', 'Test RCA Config')
    await eyes.check('check', Target.window())
    await eyes.close()
    await eyes.getRunner().getAllTestResults()
  })
})
