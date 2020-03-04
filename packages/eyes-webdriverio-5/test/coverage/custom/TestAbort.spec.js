'use strict'
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const expect = chai.expect
const {
  Configuration,
  Target,
  BrowserType,
  DeviceName,
  ScreenOrientation,
  ClassicRunner,
  VisualGridRunner,
  Eyes,
  StitchMode,
  BatchInfo,
} = require('../../../index')
const {remote} = require('webdriverio')
const appName = 'Test abort'
const testedUrl = 'https://applitools.com/docs/topics/overview.html'
const batch = new BatchInfo('WebDriverIO 5 tests')
describe(appName, () => {
  let browser, eyes, config, runner
  after(async () => {
    await displayRunInfo(runner)
  })

  beforeEach(async () => {
    browser = await remote({
      logLevel: 'silent',
      capabilities: {
        browserName: 'chrome',
      },
    })
    // await browser.init()
  })

  afterEach(async () => {
    if (eyes.getIsOpen()) {
      await eyes.close(false)
    } else {
      await eyes.abort()
    }
    await browser.deleteSession()
  })

  function Test_ThrowBeforeOpen() {
    let testConfig = eyes.getConfiguration()
    testConfig.setTestName(`test URL : ${testedUrl}`)
    eyes.setConfiguration(testConfig)
    throw new Error('Before Open')
  }

  async function Test_ThrowAfterOpen() {
    let testConfig = eyes.getConfiguration()
    testConfig.setTestName(`test URL : ${testedUrl}`)
    eyes.setConfiguration(testConfig)
    await eyes.open(browser)
    throw new Error('After Open')
  }

  async function Test_ThrowDuringCheck() {
    let testConfig = eyes.getConfiguration()
    testConfig.setTestName(`test URL : ${testedUrl}`)
    eyes.setConfiguration(testConfig)
    let driver = await eyes.open(browser)
    await driver.url(testedUrl)
    await eyes.check(`Step 1 Content - ${testedUrl}`, Target.frame('non-existing frame'))
  }

  async function Test_ThrowAfterCheck() {
    let testConfig = eyes.getConfiguration()
    testConfig.setTestName(`test URL : ${testedUrl}`)
    eyes.setConfiguration(testConfig)
    let driver = await eyes.open(browser)
    await driver.url(testedUrl)
    await eyes.check(`Step 1 Content - ${testedUrl}`, Target.window())
    throw new Error('After Check')
  }

  describe(`TestAbort`, () => {
    before(async () => {
      config = getConfig()
      config.setStitchMode(StitchMode.CSS)
      runner = new ClassicRunner()
    })

    beforeEach(async () => {
      eyes = new Eyes(runner)
      eyes.setConfiguration(config)
    })

    it(`Test_ThrowBeforeOpen`, async () => {
      expect(Test_ThrowBeforeOpen).to.throw('Before Open')
    })

    it(`Test_ThrowAfterOpen`, async () => {
      await expect(Test_ThrowAfterOpen()).to.be.rejectedWith(Error, 'After Open')
    })

    it(`Test_ThrowDuringCheck`, async () => {
      await expect(Test_ThrowDuringCheck()).to.be.rejectedWith(Error)
    })

    it(`Test_ThrowAfterCheck`, async () => {
      await expect(Test_ThrowAfterCheck()).to.be.rejectedWith(Error, 'After Check')
    })
  })

  describe(`TestAbort_VG`, () => {
    before(async () => {
      config = getConfig()
      runner = new VisualGridRunner()
    })

    beforeEach(async () => {
      eyes = new Eyes(runner)
      eyes.setConfiguration(config)
    })

    it(`Test_ThrowBeforeOpen`, async () => {
      expect(Test_ThrowBeforeOpen).to.throw('Before Open')
    })

    it(`Test_ThrowAfterOpen`, async () => {
      await expect(Test_ThrowAfterOpen()).to.be.rejectedWith(Error, 'After Open')
    })

    it(`Test_ThrowDuringCheck`, async () => {
      await expect(Test_ThrowDuringCheck()).to.be.rejectedWith(Error)
    })

    it(`Test_ThrowAfterCheck`, async () => {
      await expect(Test_ThrowAfterCheck()).to.be.rejectedWith(Error, 'After Check')
    })
  })
})

function getConfig() {
  let config = new Configuration()
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
  return config
}

async function displayRunInfo(runner) {
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
}
