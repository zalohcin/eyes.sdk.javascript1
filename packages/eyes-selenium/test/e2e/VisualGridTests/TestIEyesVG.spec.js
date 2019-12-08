'use strict'

const assert = require('assert')
const {By} = require('selenium-webdriver')
const {
  Target,
  Eyes,
  BatchInfo,
  RectangleSize,
  ConsoleLogHandler,
  VisualGridRunner,
  Configuration,
  BrowserType,
} = require('../../../index')
const {TestDataProvider} = require('../TestDataProvider')
const {SeleniumUtils} = require('../Utils/SeleniumUtils')
const {TestUtils} = require('../Utils/TestUtils')

describe('TestIEyesVG', function() {
  this.timeout(5 * 60 * 1000)

  let logger
  let runner
  const renderingConfiguration = new Configuration()
  const batchInfo = new BatchInfo('Top Sites - Visual Grid')

  /**
   * @param {WebDriver} webDriver
   * @param {string} testedUrl
   * @return {Eyes}
   */
  async function initEyes(webDriver, testedUrl) {
    runner = new VisualGridRunner(40)
    const eyes = new Eyes(runner)
    eyes.setLogHandler(new ConsoleLogHandler(false))
    eyes.getLogger().log(`creating WebDriver: ${testedUrl}`)
    logger = eyes.getLogger()

    renderingConfiguration.setAppName('Top Sites')
    renderingConfiguration.setBatch(batchInfo)
    renderingConfiguration.addBrowser(800, 600, BrowserType.CHROME)
    renderingConfiguration.addBrowser(700, 500, BrowserType.FIREFOX)
    renderingConfiguration.addBrowser(1200, 800, BrowserType.IE_10)
    renderingConfiguration.addBrowser(1200, 800, BrowserType.IE_11)
    renderingConfiguration.setTestName(`Top Sites - ${testedUrl}`)

    eyes.getLogger().log(`created configurations for url ${testedUrl}`)
    eyes.setConfiguration(renderingConfiguration)
    await eyes.open(webDriver)
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
    // nothing
  }

  // /**
  //  * @param {Eyes} eyes
  //  * @param {TestResults} results
  //  */
  // async function ValidateRunnerResults(eyes, results) {
  //   // const browserTypes = [
  //   //   { BrowserType.CHROME, "CHROME" },
  //   //   { BrowserType.FIREFOX, "FIREFOX" },
  //   //   { BrowserType.EDGE, "EDGE" },
  //   //   { BrowserType.IE_10, "IE 10.0" },
  //   //   { BrowserType.IE_11, "IE 11.0" },
  //   // ];
  //
  //   const browsers = renderingConfiguration.getBrowsersInfo();
  //   const resultsSummary = await runner.getAllTestResults(false);
  //
  //   logger.log(resultsSummary);
  //
  //   const testResultsContainer = resultsSummary.getAllResults();
  //
  //   for (const testResultContainer of testResultsContainer) {
  //     const testResults = testResultContainer.getTestResults();
  //     const sessionResults = await TestUtils.getSessionResults(runner.getApiKey(), testResults);
  //
  //     const actualAppOutputs = sessionResults.getActualAppOutput();
  //     assert.strictEqual(2, actualAppOutputs.length);
  //
  //     const image1 = actualAppOutputs[0].getImage();
  //     assert.ok(image1.getHasDom());
  //     const hostDisplaySize = testResults.getHostDisplaySize();
  //     assert.strictEqual(hostDisplaySize.getWidth(), image1.getSize().getWidth());
  //     assert.strictEqual(hostDisplaySize.getHeight(), image1.getSize().getHeight());
  //
  //     const image2 = actualAppOutputs[1].getImage();
  //     assert.ok(image2.getHasDom());
  //
  //     // TODO: Env is not implemented in JS
  //     const env = sessionResults.Env;
  //     const browser = browsers.find((item) => {
  //       return (env.HostingAppInfo?.StartsWith(browserTypes[item.BrowserType], StringComparison.OrdinalIgnoreCase) ?? false) &&
  //       (env.DisplaySize.Width == item.Width) && (env.DisplaySize.Height == item.Height);
  //    });
  //     assert.ok(browser, $"browser {env.HostingAppInfo}, {env.DisplaySize} was not found in list:{Environment.NewLine}\t{browsers.Concat($",{Environment.NewLine}\t")}");
  //     browsers.remove(browser);
  //   }
  //   assert.ok(browsers.length === 0);
  // }

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
