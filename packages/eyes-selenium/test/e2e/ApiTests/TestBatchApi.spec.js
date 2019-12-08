'use strict'

const assert = require('assert')
const {
  Eyes,
  ClassicRunner,
  Target,
  BatchInfo,
  RectangleSize,
  StitchMode,
} = require('../../../index')
const {SeleniumUtils} = require('../Utils/SeleniumUtils')
const {TestUtils} = require('../Utils/TestUtils')

describe('TestBatchApi', function() {
  it('TestCloseBatch', async function() {
    const driver = SeleniumUtils.createChromeDriver()
    // Initialize the VisualGridEyes SDK and set your private API key.
    const runner = new ClassicRunner()
    const eyes = new Eyes(runner)
    TestUtils.setupLogging(eyes)

    eyes.setSendDom(false)
    eyes.setStitchMode(StitchMode.CSS)

    const batchInfo = new BatchInfo('Runner Testing')
    eyes.setBatch(batchInfo)

    // Navigate the browser to the "hello world!" web-site.
    driver.get('https://applitools.com/helloworld')
    let batch
    try {
      await eyes.open(
        driver,
        'Applitools Eyes SDK',
        'Classic Runner Test',
        new RectangleSize(1200, 800),
      )
      await eyes.check(null, Target.window().withName('Step 1'))
      await eyes.close()
    } finally {
      await driver.quit()
    }

    batch = TestUtils.getBatchInfo(eyes)
    assert.ok(!batch.getIsCompleted())

    await runner.getAllTestResults(false)

    batch = TestUtils.getBatchInfo(eyes)
    assert.ok(batch.getIsCompleted())
  })
})
