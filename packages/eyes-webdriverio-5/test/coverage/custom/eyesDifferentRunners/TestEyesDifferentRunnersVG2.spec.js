'use strict'
const {
  MatchLevel,
} = require('../../../../index')
const {getDriver, getBatch, getEyes} = require('../util/TestSetup')
const {testSetup, getCheckSettings} = require('../util/EyesDifferentRunners')
const batch = getBatch()

describe('TestEyesDifferentRunners VG2', () => {
  afterEach(async function() {
    await this.browser.deleteSession()
    await this.eyes.abortIfNotClosed()
  })

  beforeEach(async function() {
    this.browser = await getDriver('CHROME')
    this.eyes = await getEyes('VG')
    this.eyes.setBatch(batch)
    this.eyes.setSaveNewTests(false)
    await this.eyes.open(this.browser, 'Top Sites', `Top Sites - ${this.currentTest.title}`, {
      width: 800,
      height: 600,
    })
  })

  let testCase = testSetup(
    getCheckSettings,
    async () =>
      console.log('Need merge of the runners updates to retrieve the test results for assertions')
  )
  let cases = [['https://amazon.com', MatchLevel.Layout]]
  cases.forEach(testData => {
    it(testData[0], testCase(...testData))
  })
})
