'use strict'

const assertRejects = require('assert-rejects')
const {
  Eyes,
  Target,
  BatchInfo,
  VisualGridRunner,
  Configuration,
  RectangleSize,
} = require('../../../index')
const {SeleniumUtils} = require('../Utils/SeleniumUtils')

describe('TestVGWithBadWebhook', function() {
  this.timeout(5 * 60 * 1000)

  it('Test', async function() {
    const driver = SeleniumUtils.createChromeDriver()
    await driver.get('https://applitools.com/helloworld')

    const batch = new BatchInfo('Visual Grid - Test bad webhook')
    const runner = new VisualGridRunner(10)
    const eyes = new Eyes(runner)

    const config = new Configuration()
    config.setBatch(batch)
    config.setAppName('Visual Grid Tests')
    config.setTestName('Bad Webhook')
    config.setViewportSize(new RectangleSize(800, 600))

    eyes.setConfiguration(config)
    await eyes.open(driver)
    await eyes.check(
      null,
      Target.window()
        .fully()
        .beforeRenderScreenshotHook('gibberish uncompilable java script'),
    )
    await driver.quit()

    await assertRejects(
      (async () => {
        await eyes.close()
        await runner.getAllTestResults()
      })(),
    )
  })
})
