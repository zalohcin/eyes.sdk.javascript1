'use strict'

const assert = require('assert')
const {Eyes, BatchInfo, VisualGridRunner, Configuration, BrowserType} = require('../../../index')
const {SeleniumUtils} = require('../Utils/SeleniumUtils')

describe('TestVGCloseAsync', function() {
  this.timeout(5 * 60 * 1000)

  const batch_ = new BatchInfo('Test Visual Grid')

  it('TestCloseAsync', async function() {
    const runner = new VisualGridRunner(10)
    const eyes = new Eyes(runner)
    let driver = SeleniumUtils.createChromeDriver()
    await driver.get('https://applitools.com/helloworld')

    try {
      const config = new Configuration()
      config
        .setAppName('Visual Grid Tests')
        .setTestName('Test CloseAsync')
        .setBatch(batch_)
      for (const b of Object.values(BrowserType)) {
        config.addBrowser(800, 600, b)
      }
      eyes.setConfiguration(config)
      const combinations = config.getBrowsersInfo()
      assert.ok(combinations.length > 1)
      await eyes.open(driver)
      await eyes.checkWindow()
      await driver.quit()

      driver = null
      const closeTasks = await eyes.closeAsync()
      assert.strictEqual(combinations.length, closeTasks.length)
      await runner.getAllTestResults()
    } finally {
      if (driver != null) {
        await driver.quit()
      }
      await eyes.abort()
    }
  })
})
