const {remote} = require('webdriverio')
const {By, Target, Eyes, ConsoleLogHandler} = require('./index')
const {FileDebugScreenshotsProvider} = require('@applitools/eyes-sdk-core')

;(async () => {
  let eyes
  let driver

  const browserOptions = {
    host: 'hub-cloud.browserstack.com',
    user: process.env.BROWSERSTACK_USERNAME,
    key: process.env.BROWSERSTACK_ACCESS_KEY,
    desiredCapabilities: {
      os: 'Windows',
      os_version: '10',
      browser: 'IE',
      browser_version: '11.0',
      // browser: 'Edge',
      // browser_version: '81.0',
    },
  }

  driver = remote(browserOptions)
  await driver.init()
  await driver.url('https://applitools.com/helloworld')

  // const {value: e} = await driver.element('.section:nth-of-type(2)')
  // console.log('XXXXXXXXX: e', e)
  // const {value: r} = await driver.execute(function(e) {
  //   const rect = e.getBoundingClientRect()
  //   return {
  //     x: rect.x !== undefined ? rect.x : rect.left,
  //     y: rect.y !== undefined ? rect.y : rect.top,
  //     height: rect.height,
  //     width: rect.width,
  //   }
  // }, e)
  // console.log('XXXXXXXXX: r', r)

  eyes = new Eyes()
  eyes.setLogHandler(new ConsoleLogHandler(true))
  eyes.setApiKey(process.env.APPLITOOLS_API_KEY)

  // const debugHandler = new FileDebugScreenshotsProvider()
  // debugHandler.setPath('./screenshots')
  // eyes.setDebugScreenshotsProvider(debugHandler)

  await eyes.open(driver, 'tt', 'tt2')
  await eyes.check(undefined, Target.region(By.css('.section:nth-of-type(2)')))
  await eyes.close()

  await driver.end()
  await eyes.abortIfNotClosed()
})()
