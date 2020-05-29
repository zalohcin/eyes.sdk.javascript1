'use strict'
const assert = require('assert')
const {getDriver, getEyes} = require('../util/TestSetup')
const {Target} = require('../../../../index')
const appName = 'Applitools Eyes SDK'
describe(appName, () => {
  let browser, eyes, runner
  beforeEach(async () => {
    browser = await getDriver('CHROME')
    eyes = await getEyes('VG')
    runner = eyes.getRunner()
  })

  afterEach(async () => {
    await eyes.abortIfNotClosed()
    await browser.deleteSession()
  })

  it.skip('TestDoubleOpenCheckClose', async () => {
    await browser.url('https://applitools.github.io/demo/TestPages/VisualGridTestPage/')
    await eyes.open(browser, appName, 'TestDoubleOpenCheckClose_VG', {
      width: 1200,
      height: 800,
    })
    await eyes.check(
      'Step 1',
      Target.window()
        .fully()
        .ignoreDisplacements(false),
    )
    await eyes.close(false)

    await eyes.open(browser, appName, 'TestDoubleOpenCheckClose_VG', {
      width: 1200,
      height: 800,
    })
    await eyes.check(
      'Step 2',
      Target.window()
        .fully()
        .ignoreDisplacements(false),
    )
    await eyes.close(false)

    let allTestResults = await runner.getAllTestResults(true)
    assert.deepStrictEqual(allTestResults.getAllResults().length, 2)
  })

  it('TestDoubleCheckDontGetAllResults', async () => {
    await browser.url('https://applitools.com/helloworld')
    await eyes.open(browser, appName, 'TestDoubleCheckDontGetAllResults_VG', {
      width: 1200,
      height: 800,
    })
    await eyes.check('Step 1', Target.window())
    await eyes.check('Step 2', Target.window())
    await eyes.close(false)
  })
})
