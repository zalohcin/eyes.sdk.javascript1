'use strict'

const {Builder, Capabilities} = require('selenium-webdriver')
const {Eyes, Target, ConsoleLogHandler} = require('../index') // should be replaced to '@applitools/eyes-appium'

;(async () => {
  const caps = new Capabilities()
  caps.set('browserName', 'iPhone')
  caps.set('app', 'bs://c7e9b159329c52275bb5de4b7a158849b8a7fd6b')
  caps.set('clearSystemFiles', true)
  caps.set('noReset', true)
  caps.set('bstack:options', {
    osVersion: '12',
    deviceName: 'iPhone XS',
    realMobile: 'true',
    userName: process.env.BROWSERSTACK_USERNAME,
    accessKey: process.env.BROWSERSTACK_ACCESS_KEY,
  })

  // const seleniumServer = 'http://127.0.0.1:4723/wd/hub';
  const seleniumServer = 'https://hub-cloud.browserstack.com/wd/hub'

  // Open the app.
  const driver = await new Builder()
    .withCapabilities(caps)
    .usingServer(seleniumServer)
    .build()

  // Initialize the eyes SDK and set your private API key.
  const eyes = new Eyes()
  // eyes.setApiKey('Your API Key');
  eyes.setLogHandler(new ConsoleLogHandler(true))

  try {
    // Start the test and set the browser's viewport size to 800x600.
    await eyes.open(driver, 'Eyes Examples', 'My first Appium native JavaScript test!')

    // Visual validation.
    await eyes.check('Contact list!', Target.window())

    // End the test.
    await eyes.close()
  } finally {
    // Close the browser.
    await driver.quit()

    // If the test was aborted before eyes.close was called ends the test as aborted.
    await eyes.abort()
  }
})()
