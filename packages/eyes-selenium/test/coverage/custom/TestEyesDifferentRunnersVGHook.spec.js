'use strict'
const {
  BrowserType,
  MatchLevel,
} = require('../../../index')
const {getDriver, getBatch, getEyes} = require('./util/TestSetup')
const {testSetup, getCheckSettingsWithHook, validateVG} = require('./util/EyesDifferentRunners')
const batch = getBatch()

describe('TestEyesDifferentRunners VG with hooks', () => {

  afterEach(async function () {
    await this.webDriver.quit()
    await this.eyes.abortIfNotClosed()
  })

  beforeEach(async function() {
    this.webDriver = await getDriver('CHROME')
    this.eyes = await getEyes('VG')
    let conf = this.eyes.getConfiguration()
    conf.setTestName(`Top Sites - ${this.currentTest.title}`)
    conf.setAppName(`Top Sites`)
    conf.setBatch(batch)
    conf.addBrowser(800, 600, BrowserType.CHROME)
    conf.addBrowser(700, 500, BrowserType.FIREFOX)
    conf.addBrowser(1200, 800, BrowserType.IE_10)
    conf.addBrowser(1200, 800, BrowserType.IE_11)
    this.eyes.setConfiguration(conf)
    this.eyes.setSaveNewTests(false)
    await this.eyes.open(this.webDriver)
  })

  let testCase = testSetup(getCheckSettingsWithHook, validateVG)
  let cases = [
    ['https://instagram.com', MatchLevel.Strict],
    ['https://twitter.com', MatchLevel.Strict],
    ['https://wikipedia.org', MatchLevel.Strict],
    [
      'https://www.target.com/c/blankets-throws/-/N-d6wsb?lnk=ThrowsBlankets%E2%80%9C,tc',
      MatchLevel.Strict,
    ],
    // ['https://youtube.com', MatchLevel.Layout],
  ]

  cases.forEach(testData => {
    it(testData[0], testCase(...testData))
  })
})
