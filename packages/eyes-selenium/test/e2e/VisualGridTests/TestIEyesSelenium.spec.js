'use strict'

const assert = require('assert')
const {Target, Eyes, BatchInfo, RectangleSize, ConsoleLogHandler} = require('../../../index')
const {TestDataProvider} = require('../TestDataProvider')
const {SeleniumUtils} = require('../Utils/SeleniumUtils')
const {TestUtils} = require('../Utils/TestUtils')

describe('TestIEyesSelenium', function() {
  this.timeout(5 * 60 * 1000)

  const batchInfo = new BatchInfo('Top Sites - Selenium')

  /**
   * @param {WebDriver} webDriver
   * @param {string} testedUrl
   * @return {Eyes}
   */
  async function initEyes(webDriver, testedUrl) {
    const eyes = new Eyes()
    eyes.setLogHandler(new ConsoleLogHandler(false))

    eyes.setBatch(batchInfo)
    await eyes.open(
      webDriver,
      'Top Sites',
      `Top Sites - ${testedUrl}`,
      new RectangleSize(1024, 768),
    )
    return eyes
  }

  /**
   * @return {CheckSettings}
   */
  function getCheckSettings() {
    return Target.window()
  }

  /**
   * @param {Eyes} eyes
   * @param {TestResults} results
   */
  async function validateResults(eyes, results) {
    // TODO: I have no idea why, but this produces an error TypeError: Cannot destructure property `tag` of 'undefined' or 'null'.
    //       at new ExpectedAppOutput (packages\eyes-sdk-core\lib\metadata\ExpectedAppOutput.js:17:15)
    const sessionResults = await TestUtils.getSessionResults(eyes.getApiKey(), results)

    const actualAppOutputs = sessionResults.getActualAppOutput()
    assert.strictEqual(2, actualAppOutputs.length)

    const image1 = actualAppOutputs[0].getImage()
    assert.ok(image1.getHasDom())
    assert.strictEqual(1024, image1.getSize().getWidth())
    assert.strictEqual(768, image1.getSize().getHeight())

    const image2 = actualAppOutputs[1].getImage()
    assert.ok(image2.getHasDom())
  }

  TestDataProvider.eyesBaseArgs().forEach(({testedUrl, matchLevel}) => {
    describe(`testedUrl: ${testedUrl}, matchLevel: ${matchLevel}`, async function() {
      it('Test', async function() {
        const webDriver = SeleniumUtils.createChromeDriver()
        let eyes
        try {
          await webDriver.get(testedUrl)
          eyes = await initEyes(webDriver, testedUrl)
          eyes.setSaveNewTests(false)
          eyes.getLogger().log(`running check for url ${testedUrl}`)
          const checkSettings = getCheckSettings()
          eyes.setMatchLevel(matchLevel)
          await eyes.check(null, checkSettings.withName(`Step1 - ${testedUrl}`))
          await eyes.check(null, checkSettings.fully().withName(`Step2 - ${testedUrl}`))
          eyes.getLogger().verbose('calling eyes_.Close() (test: {0})', testedUrl)
          const results = await eyes.close(false)
          await validateResults(eyes, results)
        } finally {
          await eyes.abort()
          await webDriver.quit()
        }
      })
    })
  })
})
