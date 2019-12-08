'use strict'

const {By, Builder} = require('selenium-webdriver')
const chrome = require('selenium-webdriver/chrome')
const {ReportingTestSuite} = require('../ReportingTestSuite')
const {TestUtils} = require('../Utils/TestUtils')
const {SeleniumUtils} = require('../Utils/SeleniumUtils')
const {TestDataProvider} = require('../TestDataProvider')
const {Eyes, Target, Region, StitchMode} = require('../../../index')

const RunMethod = {
  ChromeEmulation: 'ChromeEmulation',
  SauceLabs: 'SauceLabs',
}

describe('TestScrolling', function() {
  this.timeout(5 * 60 * 1000)

  const /** @type {ReportingTestSuite} */ testSetup = new ReportingTestSuite()
  before(async function() {
    await testSetup.oneTimeSetup()
  })
  beforeEach(async function() {
    await testSetup.setup(this)
  })
  afterEach(async function() {
    await testSetup.tearDown(this)
  })
  after(async function() {
    await testSetup.oneTimeTearDown()
  })
  ;[
    {runMethod: RunMethod.ChromeEmulation},
    // { runMethod: RunMethod.SauceLabs },
  ].forEach(({runMethod}) => {
    describe(`runMethod ${runMethod}`, async function() {
      it('TestWebAppScrolling', async function() {
        let driver
        switch (runMethod) {
          case RunMethod.SauceLabs: {
            const options2 = new chrome.Options()
            options2.set('name', 'TestWebAppScrolling')
            options2.set('username', TestDataProvider.SAUCE_USERNAME)
            options2.set('accessKey', TestDataProvider.SAUCE_ACCESS_KEY)

            options2.set('deviceName', 'Samsung Galaxy S9 WQHD GoogleAPI Emulator')
            options2.set('deviceOrientation', 'portrait')
            options2.set('platformVersion', '8.1')
            options2.set('platformName', 'Android')
            driver = await new Builder()
              .usingServer(TestDataProvider.SAUCE_SELENIUM_URL)
              .withCapabilities(options2)
              .build()
            break
          }
          default: {
            const options = new chrome.Options()
            options.setMobileEmulation({
              width: 360,
              height: 740,
              pixelRatio: 4.0,
              userAgent:
                'Mozilla/5.0 (Linux; Android 8.0.0; SM-G960F Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.137 Mobile Safari/537.36',
            })
            driver = SeleniumUtils.createChromeDriver(options)
            break
          }
        }

        await driver.get('https://applitools.github.io/demo/TestPages/MobileDemo/adaptive.html')

        const eyes = new Eyes()
        try {
          TestUtils.setupLogging(eyes)
          eyes.setBatch(TestDataProvider.BatchInfo)
          const eyesDriver = await eyes.open(driver, 'TestScrolling', 'TestWebAppScrolling')

          const contentElement = await eyesDriver.findElement(By.className('content'))
          const s = contentElement.getScrollSize()

          const regions = []
          for (let i = 0; i < s.getHeight(); i += 6000) {
            const height = Math.min(6000, s.getHeight() - i)
            const region = Target.region(new Region(0, i, s.getWidth(), height))
              .withName('TestWebAppScrolling')
              .fully()
              .scrollRootElement(contentElement)
            regions.push(region)
          }

          await eyes.check(null, regions)
          await eyes.close()
        } finally {
          await eyes.abort()
          await driver.quit()
        }
      })

      it('TestWebAppScrolling2', async function() {
        let driver
        switch (runMethod) {
          case RunMethod.SauceLabs: {
            const options2 = new chrome.Options()
            options2.set('name', 'TestWebAppScrolling2')
            options2.set('username', TestDataProvider.SAUCE_USERNAME)
            options2.set('accessKey', TestDataProvider.SAUCE_ACCESS_KEY)

            options2.set('deviceName', 'Samsung Galaxy S9 WQHD GoogleAPI Emulator')
            options2.set('deviceOrientation', 'portrait')
            options2.set('platformVersion', '8.1')
            options2.set('platformName', 'Android')
            driver = await new Builder()
              .usingServer(TestDataProvider.SAUCE_SELENIUM_URL)
              .withCapabilities(options2)
              .build()
            break
          }
          default: {
            const options = new chrome.Options()
            options.setMobileEmulation({
              width: 386,
              height: 512,
              pixelRatio: 4.0,
              userAgent:
                'Mozilla/5.0 (Linux; Android 7.1.1; Nexus 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36',
            })
            driver = SeleniumUtils.createChromeDriver(options)
            break
          }
        }

        await driver.get('https://applitools.github.io/demo/TestPages/MobileDemo/AccessPayments/')

        const eyes = new Eyes()
        try {
          TestUtils.setupLogging(eyes)
          eyes.setBatch(TestDataProvider.BatchInfo)
          const eyesDriver = await eyes.open(driver, 'TestScrolling', 'TestWebAppScrolling2')
          eyes.setStitchMode(StitchMode.CSS)
          await eyes.check('big page on mobile', Target.window().fully())
          await eyes.close()
        } finally {
          await eyes.abort()
          await driver.quit()
        }
      })

      it('TestWebAppScrolling3', async function() {
        let driver
        switch (runMethod) {
          case RunMethod.SauceLabs: {
            const options2 = new chrome.Options()
            options2.set('name', 'TestWebAppScrolling3')
            options2.set('username', TestDataProvider.SAUCE_USERNAME)
            options2.set('accessKey', TestDataProvider.SAUCE_ACCESS_KEY)

            options2.set('deviceName', 'Samsung Galaxy S9 WQHD GoogleAPI Emulator')
            options2.set('deviceOrientation', 'portrait')
            options2.set('platformVersion', '8.1')
            options2.set('platformName', 'Android')
            driver = await new Builder()
              .usingServer(TestDataProvider.SAUCE_SELENIUM_URL)
              .withCapabilities(options2)
              .build()
            break
          }
          default: {
            const options = new chrome.Options()
            options.setMobileEmulation({
              width: 386,
              height: 512,
              pixelRatio: 1.0,
              userAgent:
                'Mozilla/5.0 (Linux; Android 7.1.1; Nexus 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36',
            })
            driver = SeleniumUtils.createChromeDriver(options)
            break
          }
        }

        await driver.get('https://www.applitools.com/customers')

        const eyes = new Eyes()
        try {
          TestUtils.setupLogging(eyes)
          eyes.setBatch(TestDataProvider.BatchInfo)
          const eyesDriver = await eyes.open(driver, 'TestScrolling', 'TestWebAppScrolling3')
          await eyes.check(
            'long page on mobile',
            Target.region(By.css('div.page'))
              .fully(false)
              .sendDom(false),
          )
          await eyes.close()
        } finally {
          await eyes.abort()
          await driver.quit()
        }
      })
    })
  })
})
