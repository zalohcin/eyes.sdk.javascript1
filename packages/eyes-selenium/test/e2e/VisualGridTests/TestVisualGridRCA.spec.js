'use strict'

const {Eyes, Target, BatchInfo, VisualGridRunner} = require('../../../index')
const {SeleniumUtils} = require('../Utils/SeleniumUtils')

describe('TestVisualGridRCA', function() {
  this.timeout(5 * 60 * 1000)

  const batch_ = new BatchInfo('Test Visual Grid RCA')

  // TODO: this test is not working as at least viewport size should be set for VG mode
  it('Test_VG_RCA_Config', async function() {
    const runner = new VisualGridRunner(10)
    const eyes = new Eyes(runner)
    eyes.setBatch(batch_)
    const driver = SeleniumUtils.createChromeDriver()
    try {
      await driver.get('https://applitools.github.io/demo/TestPages/VisualGridTestPage')
      await eyes.open(driver, 'Test Visual Grid', 'Test RCA Config')
      eyes.setSendDom(true)
      await eyes.check(null, Target.window())
      await eyes.close()
      await runner.getAllTestResults()
    } finally {
      await driver.quit()
    }
  })

  it('Test_VG_RCA_Fluent', async function() {
    const runner = new VisualGridRunner(10)
    const eyes = new Eyes(runner)
    eyes.setBatch(batch_)
    let driver = SeleniumUtils.createChromeDriver()
    try {
      driver = await driver.get('https://applitools.github.io/demo/TestPages/VisualGridTestPage')

      await driver.switchTo().frame('iframe')
      await driver.sleep(1000)
      await driver.switchTo().defaultContent()

      await eyes.open(driver, 'Test Visual Grid', 'Test RCA Fluent')
      eyes.setSendDom(false)
      await eyes.check(null, Target.window().sendDom(true))
      await eyes.close()
      await runner.getAllTestResults()
    } finally {
      await driver.quit()
    }
  })
})
