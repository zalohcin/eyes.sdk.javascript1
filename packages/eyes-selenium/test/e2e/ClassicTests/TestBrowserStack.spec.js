'use strict'

const {Builder} = require('selenium-webdriver')
const {Options: IEOptions} = require('selenium-webdriver/ie')
const {Eyes, Target, StitchMode, RectangleSize} = require('../../../index')
const {TestUtils} = require('../Utils/TestUtils')
const {TestDataProvider} = require('../TestDataProvider')

describe('TestBrowserStack', function() {
  this.timeout(5 * 60 * 1000)
  ;[{stitchMode: StitchMode.CSS}, {stitchMode: StitchMode.SCROLL}].forEach(({stitchMode}) => {
    describe(`stitchMode: ${stitchMode}`, function() {
      it('TestCloseAsync', async function() {
        const eyes = new Eyes()
        TestUtils.setupLogging(eyes)

        const options = new IEOptions()
        options.setBrowserVersion('11.0')
        options.set('resolution', '1024x768')

        options.set('os', 'Windows')
        options.set('os_version', '10')
        options.set('browserstack.user', TestDataProvider.BROWSERSTACK_USERNAME)
        options.set('browserstack.key', TestDataProvider.BROWSERSTACK_ACCESS_KEY)

        let driver
        try {
          driver = await new Builder()
            .usingServer(TestDataProvider.BROWSERSTACK_SELENIUM_URL)
            .withCapabilities(options)
            .build()
          await driver.get('https://applitools.github.io/demo/TestPages/FramesTestPage/')
          eyes.setStitchMode(stitchMode)
          eyes.setBatch(TestDataProvider.BatchInfo)
          await eyes.open(
            driver,
            'TestBrowserStack',
            `TesIE11_${stitchMode}`,
            new RectangleSize(800, 600),
          )
          await eyes.check(
            'viewport',
            Target.window()
              .fully(false)
              .sendDom(false),
          )
          await eyes.check(
            'full page',
            Target.window()
              .fully(true)
              .sendDom(false),
          )
          await eyes.close()
        } finally {
          await driver.quit()
          await eyes.abort()
        }
      })
    })
  })
})
