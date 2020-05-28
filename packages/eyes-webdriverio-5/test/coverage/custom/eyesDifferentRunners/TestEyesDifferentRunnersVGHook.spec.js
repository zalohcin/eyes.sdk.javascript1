'use strict'
const {
  BrowserType,
  MatchLevel,
} = require('../../../../index')
const {getDriver, getBatch, getEyes} = require('../util/TestSetup')
const {testSetup, getCheckSettingsWithHook, validateVG} = require('../util/EyesDifferentRunners')
const batch = getBatch()

describe('TestEyesDifferentRunners VG with hooks', () => {

  afterEach(async function () {
    await this.browser.deleteSession()
    await this.eyes.abortIfNotClosed()
  })

  beforeEach(async function() {
    this.browser = await getDriver('CHROME')
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
    await this.eyes.open(this.browser)
  })

  let testCase = testSetup(getCheckSettingsWithHook, validateVG)
  let cases = [
    ['https://instagram.com', MatchLevel.Strict],
    ['https://twitter.com', MatchLevel.Strict],
  ]

  cases.forEach(testData => {
    it(testData[0], testCase(...testData))
  })
})
