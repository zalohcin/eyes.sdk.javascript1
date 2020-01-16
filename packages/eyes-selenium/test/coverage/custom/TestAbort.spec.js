'use strict'
const {getDriver, getEyes, getSetups} = require('./util/TestSetup')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const expect = chai.expect
const {
  Configuration,
  BatchInfo,
  Target,
  BrowserType,
  DeviceName,
  ScreenOrientation,
} = require('../../../index')
const appName = 'Test Abort'
const testedUrl = 'https://applitools.com/docs/topics/overview.html'
describe(appName, () => {
  let setups = getSetups()
  let batch = new BatchInfo('JS test')
  setups.forEach(setup => {
    describe(`TestAbort${setup.title}`, () => {
      let webDriver, eyes, config
      before(async () => {
        config = new Configuration()
        config.setAppName(appName)
        config.setBatch(batch)
        config.setViewportSize({width: 800, height: 600})
        config.addBrowser(900, 600, BrowserType.CHROME)
        config.addBrowser(1024, 786, BrowserType.CHROME)
        config.addBrowser(900, 600, BrowserType.FIREFOX)
        config.addBrowser(900, 600, BrowserType.IE_10)
        config.addBrowser(900, 600, BrowserType.IE_11)
        config.addBrowser(900, 600, BrowserType.EDGE)
        config.addDeviceEmulation(DeviceName.iPhone_4, ScreenOrientation.PORTRAIT)
        config.addDeviceEmulation(DeviceName.Galaxy_S5, ScreenOrientation.LANDSCAPE)
      })

      beforeEach(async () => {
        let defaults = await getEyes(setup.runnerType, setup.stitchMode, {config: config})
        eyes = defaults.eyes
        webDriver = await getDriver('CHROME')
      })

      afterEach(async () => {
        if (eyes.getIsOpen()) {
          await eyes.close()
        } else {
          await eyes.abort()
        }
        await webDriver.quit()
      })

      it(`Test_ThrowBeforeOpen`, async () => {
        expect(Test_ThrowBeforeOpen).to.throw('Before Open')
        function Test_ThrowBeforeOpen() {
          let testConfig = eyes.getConfiguration()
          testConfig.setTestName(`test before open URL: ${testedUrl}`)
          eyes.setConfiguration(testConfig)
          throw new Error('Before Open')
        }
      })

      it(`Test_ThrowAfterOpen`, async () => {
        await expect(Test_ThrowAfterOpen()).to.be.rejectedWith(Error, 'After Open')
        async function Test_ThrowAfterOpen() {
          let testConfig = eyes.getConfiguration()
          testConfig.setTestName(`test after open URL: ${testedUrl}`)
          eyes.setConfiguration(testConfig)
          await eyes.open(webDriver)
          throw new Error('After Open')
        }
      })

      it(`Test_ThrowDuringCheck`, async () => {
        await expect(Test_ThrowDuringCheck()).to.be.rejectedWith(Error)
        async function Test_ThrowDuringCheck() {
          let testConfig = eyes.getConfiguration()
          testConfig.setTestName(`test URL during check: ${testedUrl}`)
          eyes.setConfiguration(testConfig)
          let driver = await eyes.open(webDriver)
          await driver.get(testedUrl)
          await eyes.check(`Step 1 Content - ${testedUrl}`, Target.frame('non-existing frame'))
        }
      })

      it(`Test_ThrowAfterCheck`, async () => {
        return expect(Test_ThrowAfterCheck()).to.be.rejectedWith(Error, 'After Check')
        async function Test_ThrowAfterCheck() {
          let testConfig = eyes.getConfiguration()
          testConfig.setTestName(`test URL after check: ${testedUrl}`)
          eyes.setConfiguration(testConfig)
          let driver = await eyes.open(webDriver)
          await driver.get(testedUrl)
          await eyes.check(`Step 1 Content - ${testedUrl}`, Target.window())
          throw new Error('After Check')
        }
      })
    })
  })
})
