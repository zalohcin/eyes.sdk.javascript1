/* eslint-disable no-unused-vars */
'use strict'

const chromedriver = require('chromedriver')
const {remote} = require('webdriverio')
const {
  Eyes,
  ClassicRunner,
  By,
  VisualGridRunner,
  ConsoleLogHandler,
  Configuration,
  BatchInfo,
  Target,
  BrowserType,
} = require('../index')

const url = process.argv[2]
if (!url) {
  throw new Error('missing url argument!')
}

;(async function() {
  console.log('Running WDIO 5 render for', url, '\n')
  chromedriver.start()

  // const runner = new ClassicRunner()
  const runner = new VisualGridRunner()
  const eyes = new Eyes(runner)

  let batch = new BatchInfo('WDIO5 Render VG')
  eyes.setBatch(batch)
  if (process.env.APPLITOOLS_SHOW_LOGS) {
    eyes.setLogHandler(new ConsoleLogHandler(true))
  }

  let configuration = new Configuration()
  configuration.setAppName('WDIO5 VG')
  configuration.setTestName('WDIO5 VG')
  configuration.addBrowser(1024, 768, BrowserType.Chrome)
  eyes.setConfiguration(configuration)

  const browser = await remote({
    capabilities: {
      browserName: 'chrome',
      'goog:chromeOptions': {
        args: ['--disable-infobars', 'headless'],
      },
    },
    path: '/',
    port: 9515,
    logLevel: 'error',
  })
  await browser.url(url)
  await eyes.open(browser, 'WDIO5 render', 'WDIO5 render', {width: 1024, height: 768})
  await eyes.check(
    'check',
    Target.region(By.css('#app > div > main > section:nth-child(2) > ul > li:nth-child(2) > div'))
      .layout()
      .strictRegions(
        By.css(
          '#app > div > main > section:nth-child(2) > ul > li:nth-child(2) > div > div._3lllR._30XnG',
        ),
      ),
  )
  await eyes.closeAsync()
  const results = await eyes.getRunner().getAllTestResults()
  await eyes.abortIfNotClosed()

  console.log('\nRender results\n\n', results.getAllResults().toString())
  await chromedriver.stop()
})()
