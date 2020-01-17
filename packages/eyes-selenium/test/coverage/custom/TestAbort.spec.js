'use strict'
const {getDriver, getSetups} = require('./util/TestSetup')
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
  ClassicRunner,
  VisualGridRunner,
  Eyes,
} = require('../../../index')
const appName = 'My application'
const testedUrl = 'https://applitools.com/docs/topics/overview.html'
describe(appName, () => {
  let setups = getSetups()
  let batch = new BatchInfo('JS My Batch')
  setups.forEach(setup => {
    describe(`TestAbort${setup.title}`, () => {
      let webDriver, eyes, config, runner
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
        if (setup.runnerType === 'classic') config.setStitchMode(setup.stitchMode)
        runner = setup.runnerType === 'classic' ? new ClassicRunner() : new VisualGridRunner()
      })

      after(async () => {
        let testResultSummary = await runner.getAllTestResults(false)
        let containers = testResultSummary.getAllResults()
        containers.forEach(container => {
          let ex = container.getException()
          if (ex) console.log(`System error occured while checking target: ${ex}`)
          let result = container.getTestResults()
          result
            ? console.log(
                `AppName = ${result.getAppName()},
                 testname = ${result.getName()},
                 Browser = ${result.getHostApp()},
                 OS = ${result.getHostOS()},
                 viewport = ${result.getHostDisplaySize()},
                 matched = ${result.getMatches()},
                 mismatched = ${result.getMismatches()},
                 missing = ${result.getMissing()},
                 aborted = ${result.getIsAborted()}\\n`,
              )
            : console.log(`No test results information available`)
        })
      })

      beforeEach(async () => {
        eyes = new Eyes(runner)
        eyes.setConfiguration(config)
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
          testConfig.setTestName(`test URL : ${testedUrl}`)
          eyes.setConfiguration(testConfig)
          throw new Error('Before Open')
        }
      })

      it(`Test_ThrowAfterOpen`, async () => {
        await expect(Test_ThrowAfterOpen()).to.be.rejectedWith(Error, 'After Open')
        async function Test_ThrowAfterOpen() {
          let testConfig = eyes.getConfiguration()
          testConfig.setTestName(`test URL : ${testedUrl}`)
          eyes.setConfiguration(testConfig)
          await eyes.open(webDriver)
          throw new Error('After Open')
        }
      })

      it(`Test_ThrowDuringCheck`, async () => {
        await expect(Test_ThrowDuringCheck()).to.be.rejectedWith(Error)
        async function Test_ThrowDuringCheck() {
          let testConfig = eyes.getConfiguration()
          testConfig.setTestName(`test URL : ${testedUrl}`)
          eyes.setConfiguration(testConfig)
          let driver = await eyes.open(webDriver)
          await driver.get(testedUrl)
          await eyes.check(`Step 1 Content - ${testedUrl}`, Target.frame('non-existing frame'))
        }
      })

      it(`Test_ThrowAfterCheck`, async () => {
        await expect(Test_ThrowAfterCheck()).to.be.rejectedWith(Error, 'After Check')
        async function Test_ThrowAfterCheck() {
          let testConfig = eyes.getConfiguration()
          testConfig.setTestName(`test URL : ${testedUrl}`)
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
