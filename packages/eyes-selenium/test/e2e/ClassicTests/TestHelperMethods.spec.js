'use strict'

const assert = require('assert')
const {Builder} = require('selenium-webdriver')
const {Options: ChromeOptions} = require('selenium-webdriver/chrome')
const {Eyes, RectangleSize} = require('../../../index')
const {TestUtils} = require('../Utils/TestUtils')

describe('TestHelperMethods', function() {
  this.timeout(5 * 60 * 1000)

  const logsPath_ = process.env.APPLITOOLS_LOGS_PATH || '.'

  it('TestSetViewportSize', async function() {
    const options = new ChromeOptions()
    options.addArguments('disable-infobars')
    if (TestUtils.RUN_HEADLESS) {
      options.headless()
    }
    const driver = new Builder().withCapabilities(options).build()

    const expectedSize = new RectangleSize(700, 499)

    try {
      await driver.get('http://viewportsizes.com/mine/')

      await Eyes.setViewportSize(driver, expectedSize)

      const screenshot = await driver.takeScreenshot()
      // screenshot.save($@"{logsPath_}\TestSetViewportSize.png");

      const actualSize = Eyes.getViewportSize(driver)

      assert.deepStrictEqual(expectedSize, actualSize, 'Sizes differ')
    } finally {
      await driver.quit()
    }
  })
})
