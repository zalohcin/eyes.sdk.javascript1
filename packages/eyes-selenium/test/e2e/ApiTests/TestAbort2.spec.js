'use strict'

const assert = require('assert')
const assertRejects = require('assert-rejects')

const {
  Eyes,
  VisualGridRunner,
  ClassicRunner,
  Configuration,
  ScreenOrientation,
  BatchInfo,
  Target,
  BrowserType,
  DeviceName,
  RectangleSize,
} = require('../../../index')
const {SeleniumUtils} = require('../Utils/SeleniumUtils')

describe('TestAbort2', function() {
  this.timeout(5 * 60 * 1000)
  ;[{useVisualGrid: true}, {useVisualGrid: false}].forEach(({useVisualGrid}) => {
    describe(`useVisualGrid: ${useVisualGrid}`, function() {
      const concurrentSessions = 5
      const viewPortWidth = 800
      const viewPortHeight = 600
      const appName = 'My application'
      const batchName = 'My batch'
      const testedUrl = 'https://applitools.com/docs/topics/overview.html'

      let runner, suiteConfig, eyes, webDriver

      before(() => {
        // 1. Create the runner that manages multiple tests
        if (useVisualGrid) {
          runner = new VisualGridRunner(concurrentSessions)
        } else {
          runner = new ClassicRunner()
        }

        // continued below....
        // 2. Create a configuration object, we will use this when setting up each test
        suiteConfig = new Configuration()

        // 3. Set the various configuration values
        suiteConfig
          // 4. Add Visual Grid browser configurations
          .addBrowser(900, 600, BrowserType.CHROME)
          .addBrowser(1024, 786, BrowserType.CHROME)
          .addBrowser(900, 600, BrowserType.FIREFOX)
          .addBrowser(900, 600, BrowserType.IE_10)
          .addBrowser(900, 600, BrowserType.IE_11)
          .addBrowser(900, 600, BrowserType.EDGE)
          .addDeviceEmulation(DeviceName.iPhone_4, ScreenOrientation.PORTRAIT)
          .addDeviceEmulation(DeviceName.Galaxy_S5, ScreenOrientation.LANDSCAPE)

          // 5. set up default Eyes configuration values
          .setBatch(new BatchInfo(batchName))
          .setAppName(appName)
          .setViewportSize(new RectangleSize(viewPortWidth, viewPortHeight))
      })

      function beforeEachTest() {
        // 1. Create the Eyes instance for the test and associate it with the runner
        eyes = new Eyes(runner)

        // 2. Set the configuration values we set up in beforeTestSuite
        eyes.setConfiguration(suiteConfig)

        // 3. Create a WebDriver for the test
        webDriver = SeleniumUtils.createChromeDriver()
      }

      function testThrowBeforeOpen() {
        // 1. Update the Eyes configuration with test specific values
        const testConfig = eyes.getConfiguration()
        testConfig.setTestName(`test URL : ${testedUrl}`)
        eyes.setConfiguration(testConfig)
        throw new Error('Before Open')
      }

      function testThrowAfterOpen() {
        // 1. Update the Eyes configuration with test specific values
        const testConfig = eyes.getConfiguration()
        testConfig.setTestName(`test URL : ${testedUrl}`)
        eyes.setConfiguration(testConfig)

        // 2. Open Eyes, the application,test name and viewport size are already configured
        const driver = eyes.open(webDriver)
        throw new Error('After Open')
      }

      function testThrowDuringCheck() {
        // 1. Update the Eyes configuration with test specific values
        const testConfig = eyes.getConfiguration()
        testConfig.setTestName(`test URL : ${testedUrl}`)
        eyes.setConfiguration(testConfig)

        // 2. open Eyes, the application,test name and viewport size are already configured
        const driver = eyes.open(webDriver)

        // 3. Now run the test
        driver.get(testedUrl)
        eyes.check(`Step 1 Content - ${testedUrl}`, Target.frame('non-existing-frame'))
      }

      function testThrowAfterCheck() {
        // 1. Update the Eyes configuration with test specific values
        const testConfig = eyes.getConfiguration()
        testConfig.setTestName(`test URL : ${testedUrl}`)
        eyes.setConfiguration(testConfig)

        // 2. Open Eyes, the application,test name and viewport size are already configured
        const driver = eyes.open(webDriver)

        // 3. Now run the test
        driver.get(testedUrl)
        eyes.check(`Step 1 Content - ${testedUrl}`, Target.window())
        throw new Error('After Check')
      }

      function AfterEachTest() {
        if (eyes.getIsOpen()) {
          eyes.close(false)
        } else {
          eyes.abort()
        }
        webDriver.quit()
      }

      /**
       * @param {TestResultContainer} summary
       * @constructor
       */
      function handleTestResults(summary) {
        const ex = summary.getException()
        if (ex != null) {
          console.log('System error occurred while checking target.')
        }

        const result = summary.getTestResults()
        if (result == null) {
          console.log('No test results information available')
        } else {
          console.log(`AppName = ${result.getAppName()}, testname = ${result.getName()}, Browser = ${result.getHostApp()},
           OS = ${result.getHostOS()} viewport = ${result.getHostDisplaySize()}, matched = ${result.getMatches()},
           mismatched = ${result.getMismatches()}, missing = ${result.getMissing()}, aborted = ${
            result.getIsAborted() ? 'aborted' : 'no'
          }\n`)
        }
      }

      it('Test_GetAllResults', async function() {
        beforeEachTest()
        assert.throws(testThrowBeforeOpen, Error, `Before Open - (VG: ${useVisualGrid})`)
        AfterEachTest()

        beforeEachTest()
        assert.throws(testThrowAfterOpen, Error, `After Open - (VG: ${useVisualGrid})`)
        AfterEachTest()

        beforeEachTest()
        if (!useVisualGrid) {
          assert.throws(testThrowDuringCheck, Error, `During Check - (VG: ${useVisualGrid})`)
        } else {
          testThrowDuringCheck()
        }
        AfterEachTest()

        beforeEachTest()
        assert.throws(testThrowAfterCheck, Error, `After Check - (VG: ${useVisualGrid})`)
        AfterEachTest()

        await assertRejects(
          runner.getAllTestResults(),
          Error,
          `GetAllTestResults - (VG: ${useVisualGrid})`,
        )
      })

      after(async () => {
        // Wait until the test results are available and retrieve them
        const allTestResults = await runner.getAllTestResults(false)
        for (const result of allTestResults.getAllResults()) {
          handleTestResults(result)
        }
      })
    })
  })
})
