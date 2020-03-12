'use strict'
const {
  Eyes,
  Target,
  VisualGridRunner,
  Configuration,
  BrowserType,
  MatchLevel,
} = require('../../../index')
const {getDriver, getBatch} = require('./util/TestSetup')
const {assertImages} = require('./util/ApiAssertions')
const batch = getBatch()

describe('TestEyesDifferentRunners', () => {
  let webDriver, eyes

  beforeEach(async () => {
    webDriver = await getDriver('CHROME')
  })
  afterEach(async () => {
    await webDriver.quit()
    await eyes.abortIfNotClosed()
  })
  describe('Selenium', () => {
    beforeEach(async function() {
      eyes = new Eyes()
      eyes.setBatch(batch)
      eyes.setSaveNewTests(false)
      await eyes.open(webDriver, 'Top Sites', `Top Sites - ${this.currentTest.title}`, {
        width: 1024,
        height: 768,
      })
    })
    let testCase = testSetup(getCheckSettings, async eyes => {
      let results = await eyes.getRunner().getAllTestResults(false)
      await assertImages(results, [
        {/*hasDom: true,*/ size: {width: 1024, height: 768}},
        {
          /*hasDom: true*/
        },
      ])
    })
    let cases = [
      ['https://instagram.com', MatchLevel.Strict],
      ['https://twitter.com', MatchLevel.Strict],
      ['https://wikipedia.org', MatchLevel.Strict],
      [
        'https://www.target.com/c/blankets-throws/-/N-d6wsb?lnk=ThrowsBlankets%E2%80%9C,tc',
        MatchLevel.Strict,
      ],
      ['https://youtube.com', MatchLevel.Layout],
    ]
    cases.forEach(testData => {
      it(testData[0], testCase(...testData))
    })
  })

  describe('Visual Grid', () => {
    beforeEach(async function() {
      let runner = new VisualGridRunner(40)
      eyes = new Eyes(runner)
      let conf = new Configuration()
      conf.setTestName(`Top Sites - ${this.currentTest.title}`)
      conf.setAppName(`Top Sites`)
      conf.setBatch(batch)
      conf.addBrowser(800, 600, BrowserType.CHROME)
      conf.addBrowser(700, 500, BrowserType.FIREFOX)
      conf.addBrowser(1200, 800, BrowserType.IE_10)
      conf.addBrowser(1200, 800, BrowserType.IE_11)
      eyes.setConfiguration(conf)
      eyes.setSaveNewTests(false)
      await eyes.open(webDriver)
    })

    describe('VG', () => {
      let testCase = testSetup(getCheckSettings, async () =>
        console.log(
          'Need merge of the runners updates to retrieve the test results for assertions',
        ),
      )
      let cases = [
        ['https://amazon.com', MatchLevel.Layout],
        ['https://applitools.com/docs/topics/overview.html', MatchLevel.Strict],
        ['https://applitools.com/features/frontend-development', MatchLevel.Strict],
        ['https://docs.microsoft.com/en-us/', MatchLevel.Strict],
        ['https://ebay.com', MatchLevel.Layout],
        ['https://facebook.com', MatchLevel.Strict],
        ['https://google.com', MatchLevel.Strict],
        ['https://instagram.com', MatchLevel.Strict],
        ['https://twitter.com', MatchLevel.Strict],
        ['https://wikipedia.org', MatchLevel.Strict],
        [
          'https://www.target.com/c/blankets-throws/-/N-d6wsb?lnk=ThrowsBlankets%E2%80%9C,tc',
          MatchLevel.Strict,
        ],
        ['https://youtube.com', MatchLevel.Layout],
      ]
      cases.forEach(testData => {
        it(testData[0], testCase(...testData))
      })
    })

    describe('VG with hooks', () => {
      let testCase = testSetup(getCheckSettingsWithHook, async () =>
        console.log(
          'Need merge of the runners updates to retrieve the test results for assertions',
        ),
      )
      let cases = [
        ['https://instagram.com', MatchLevel.Strict],
        ['https://twitter.com', MatchLevel.Strict],
        ['https://wikipedia.org', MatchLevel.Strict],
        [
          'https://www.target.com/c/blankets-throws/-/N-d6wsb?lnk=ThrowsBlankets%E2%80%9C,tc',
          MatchLevel.Strict,
        ],
        ['https://youtube.com', MatchLevel.Layout],
      ]

      cases.forEach(testData => {
        it(testData[0], testCase(...testData))
      })
    })
  })

  describe('VG2', () => {
    beforeEach(async function() {
      let runner = new VisualGridRunner(10)
      eyes = new Eyes(runner)
      eyes.setBatch(batch)
      eyes.setSaveNewTests(false)
      await eyes.open(webDriver, 'Top Sites', `Top Sites - ${this.currentTest.title}`, {
        width: 800,
        height: 600,
      })
    })

    let testCase = testSetup(getCheckSettings, async () =>
      console.log('Need merge of the runners updates to retrieve the test results for assertions'),
    )
    let cases = [['https://amazon.com', MatchLevel.Layout]]
    cases.forEach(testData => {
      it(testData[0], testCase(...testData))
    })
  })

  function testSetup(getCheckSettings, validateResults) {
    return function(url, matchingLevel) {
      return async function() {
        await webDriver.get(url)
        eyes.setMatchLevel(matchingLevel)
        let checkSettings = getCheckSettings()
        await eyes.check(`Step 1 - ${url}`, checkSettings)
        await eyes.check(`Step 2 - ${url}`, checkSettings.fully())
        await eyes.close(false)
        await validateResults(eyes /*.getTestResults()*/)
      }
    }
  }
})

function getCheckSettings() {
  return Target.window()
}
function getCheckSettingsWithHook() {
  return getCheckSettings().beforeRenderScreenshotHook(
    'document.body.style="background-color: red"',
  )
}
