'use strict'

const assert = require('assert')
const {GeneralUtils} = require('@applitools/eyes-common')
const {Eyes, Target, RectangleSize} = require('../../../index')
const {SeleniumUtils} = require('../Utils/SeleniumUtils')
const {TestDataProvider} = require('../TestDataProvider')

describe('TestServerStatus', function() {
  this.timeout(5 * 60 * 1000)

  it('TestSessionSummary_Status_Failed', async function() {
    const eyes = new Eyes()
    eyes.setBatch(TestDataProvider.BatchInfo)
    eyes.setSaveNewTests(true)
    const webDriver = SeleniumUtils.createChromeDriver()

    const guid = `_${GeneralUtils.guid()}`

    await eyes.open(
      webDriver,
      `TestServerStatus${guid}`,
      `TestServerStatus${guid}`,
      new RectangleSize(800, 600),
    )
    await webDriver.get('https://applitools.github.io/demo/TestPages/DynamicResolution/mobile.html')
    try {
      await eyes.check(`TestSessionSummary_Status_Failed${guid}`, Target.window().fully(false))
      await eyes.close(false)
    } finally {
      await eyes.abort()
    }

    await eyes.open(
      webDriver,
      `TestServerStatus${guid}`,
      `TestServerStatus${guid}`,
      new RectangleSize(800, 600),
    )
    await webDriver.get(
      'https://applitools.github.io/demo/TestPages/DynamicResolution/desktop.html',
    )
    try {
      await eyes.check(`TestSessionSummary_Status_Failed${guid}`, Target.window().fully(false))
      const results = await eyes.close(false)
      assert.ok(results.getIsDifferent())
    } finally {
      await eyes.abort()
      await webDriver.quit()
    }
  })

  it('TestSessionSummary_Status_New', async function() {
    const eyes = new Eyes()
    eyes.setSaveNewTests(false)

    const webDriver = SeleniumUtils.createChromeDriver()

    const guid = `_${GeneralUtils.guid()}`
    const driver = await eyes.open(
      webDriver,
      `TestServerStatus${guid}`,
      `TestServerStatus${guid}`,
      new RectangleSize(800, 600),
    )

    await driver.get('https://applitools.github.io/demo/TestPages/FramesTestPage/')
    try {
      await eyes.check(`TestSessionSummary_Status_New${guid}`, Target.window())
      const results = await eyes.close(false)
      assert.ok(results.getIsNew())
    } finally {
      await eyes.abort()
      await driver.quit()
    }
  })
})
