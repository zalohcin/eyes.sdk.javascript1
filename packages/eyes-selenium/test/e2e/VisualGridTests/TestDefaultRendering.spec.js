'use strict'

const assert = require('assert')
const {Eyes, Target, VisualGridRunner, BrowserType} = require('../../../index')
const {SeleniumUtils} = require('../Utils/SeleniumUtils')

describe('TestDefaultRendering', function() {
  this.timeout(5 * 60 * 1000)

  it('TestDefaultRenderingOfMultipleTargets', async function() {
    const driver = SeleniumUtils.createChromeDriver()
    await driver.get('https://applitools.com/helloworld')
    const runner = new VisualGridRunner(10)
    const eyes = new Eyes(runner)
    const config = eyes.getConfiguration()
    config.addBrowser(800, 600, BrowserType.CHROME)
    config.addBrowser(800, 600, BrowserType.FIREFOX)
    config.addBrowser(1200, 800, BrowserType.CHROME)
    config.addBrowser(1200, 800, BrowserType.FIREFOX)
    config.setAppName('TestDefaultRendering').setTestName('TestDefaultRenderingOfMultipleTargets')
    eyes.setConfiguration(config)

    try {
      await eyes.open(driver)
      await eyes.check(null, Target.window())
      await eyes.close()
    } finally {
      await eyes.abort()
      await driver.quit()
    }

    const allTestResults = await runner.getAllTestResults()
    let batchId, batchName
    for (const trc of allTestResults) {
      if (!batchId) batchId = trc.getTestResults().getBatchId()
      if (!batchName) batchName = trc.getTestResults().getBatchName()
      assert.strictEqual(batchId, trc.getTestResults().getBatchId())
      assert.strictEqual(batchName, trc.getTestResults().getBatchName())
    }
  })
})
