'use strict'
const {MatchLevel} = require('../../../../index')
const {getDriver, getBatch, getEyes} = require('../util/TestSetup')
const {assertImages} = require('../util/ApiAssertions')
const {testSetup, getCheckSettings} = require('../util/EyesDifferentRunners')
const batch = getBatch()

describe('TestEyesDifferentRunners Selenium', () => {
  beforeEach(async function() {
    this.webDriver = await getDriver('CHROME')
    this.eyes = await getEyes('classic')
    this.eyes.setBatch(batch)
    this.eyes.setSaveNewTests(false)
    this.eyes.setSendDom(true)
    await this.eyes.open(this.webDriver, 'Top Sites', `Top Sites - ${this.currentTest.title}`, {
      width: 1024,
      height: 768,
    })
  })
  afterEach(async function() {
    await this.webDriver.quit()
    await this.eyes.abortIfNotClosed()
  })
  let testCase = testSetup(getCheckSettings, async eyes => {
    let results = await eyes.getRunner().getAllTestResults(false)
    await assertImages(results, [
      {/*hasDom: true,*/ size: {width: 1024, height: 768}},
      {
        /*hasDom: true,*/
      },
    ])
  })
  let cases = [
    ['https://instagram.com', MatchLevel.Strict],
    ['https://twitter.com', MatchLevel.Strict],
    ['https://wikipedia.org', MatchLevel.Strict],
  ]
  cases.forEach(testData => {
    it(testData[0], testCase(...testData))
  })
})
