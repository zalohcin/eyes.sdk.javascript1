/* eslint-disable no-unused-vars */
'use strict'

require('chromedriver')
const {Builder, Capabilities} = require('selenium-webdriver')
const {Options: ChromeOptions} = require('selenium-webdriver/chrome')
const {
  Eyes,
  ClassicRunner,
  Target,
  ConsoleLogHandler,
  FileDebugScreenshotsProvider,
} = require('../index')

const url = process.argv[2]
if (!url) {
  throw new Error('missing url argument!')
}

;(async function() {
  console.log('Running Selenium render for', url, '\n')
  const driver = await new Builder()
    .withCapabilities(Capabilities.chrome())
    .setChromeOptions(new ChromeOptions().headless())
    .build()

  const runner = new ClassicRunner()
  const eyes = new Eyes(runner)

  //   const debugHandler = new FileDebugScreenshotsProvider()
  //   debugHandler.setPath('./')
  //   eyes.setDebugScreenshotsProvider(debugHandler)

  if (process.env.APPLITOOLS_SHOW_LOGS) {
    eyes.setLogHandler(new ConsoleLogHandler(true))
  }

  await driver.get(url)
  await eyes.open(driver, 'selenium render', 'selenium render', {width: 1024, height: 768})
  await eyes.check('selenium render', Target.window())
  await eyes.close(false)

  const results = await runner.getAllTestResults(false)
  console.log('\nRender results\n\n', results.getAllResults().toString())
})()
