'use strict';

const assert = require('assert');
const assertRejects = require('assert-rejects');
const { ReportingTestSuite } = require('../ReportingTestSuite');
const { TestUtils } = require('../Utils/TestUtils');
const { SeleniumUtils } = require('../Utils/SeleniumUtils');
const { TestDataProvider } = require('../TestDataProvider');
const { Eyes, Configuration, VisualGridRunner, BrowserType, MatchLevel, AccessibilityLevel, DeviceName } = require('../../../index');

describe('TestVGServerConfigs', function () {
  this.timeout(5 * 60 * 1000);

  const /** @type {ReportingTestSuite} */ testSetup = new ReportingTestSuite();
  before(async function () { await testSetup.oneTimeSetup(); });
  beforeEach(async function () { await testSetup.setup(this); });
  afterEach(async function () { await testSetup.tearDown(this); });
  after(async function () { await testSetup.oneTimeTearDown(); });

  it('TestVGDoubleCloseNoCheck', async function () {
    const driver = SeleniumUtils.createChromeDriver();
    try {
      const runner = new VisualGridRunner(10);
      const eyes = new Eyes(runner);
      const conf = new Configuration();
      conf.setAppName('app').setTestName('test');
      conf.setBatch(TestDataProvider.BatchInfo);
      eyes.setConfiguration(conf);

      await eyes.open(driver);
      await assertRejects(eyes.close(), /IllegalState: Eyes not open/);
    } finally {
      await driver.quit();
    }
  });

  it('TestVGChangeConfigAfterOpen', async function () {
    const driver = SeleniumUtils.createChromeDriver();
    try {
      const runner = new VisualGridRunner(10);
      const eyes = new Eyes(runner);

      const conf = new Configuration();

      conf.setAppName('app').setTestName('test');
      conf.setBatch(TestDataProvider.BatchInfo);

      conf.addBrowser(800, 600, BrowserType.CHROME);
      conf.addBrowser(1200, 800, BrowserType.CHROME);
      conf.addDeviceEmulation(DeviceName.Galaxy_S5);
      conf.addDeviceEmulation(DeviceName.Galaxy_S3);
      conf.addDeviceEmulation(DeviceName.iPhone_4);
      conf.addDeviceEmulation(DeviceName.iPhone_5SE);
      conf.addDeviceEmulation(DeviceName.iPad);

      conf.setAccessibilityValidation(AccessibilityLevel.None).setIgnoreDisplacements(false);
      eyes.setConfiguration(conf);

      await eyes.open(driver);

      conf.setAccessibilityValidation(AccessibilityLevel.AAA).setIgnoreDisplacements(true);
      eyes.setConfiguration(conf);

      await eyes.checkWindow();

      conf.setAccessibilityValidation(AccessibilityLevel.AA).setMatchLevel(MatchLevel.Layout);
      eyes.setConfiguration(conf);

      await eyes.checkWindow();

      await eyes.close(false);
      const resultsSummary = await runner.getAllTestResults(false);

      assert.strictEqual(7, resultsSummary.getAllResults().length);

      for (const resultsContainer of resultsSummary.getAllResults()) {
        const results = resultsContainer.getTestResults();

        const sessionResults = TestUtils.getSessionResults(eyes.getApiKey(), results);

        // TODO: getBrowserInfo is not implemented in JS
        // const browserInfo = resultsContainer.getBrowserInfo().toString();
        //
        // assert.strictEqual(AccessibilityLevel.None, sessionResults.getStartInfo().getDefaultMatchSettings().AccessibilityLevel, browserInfo);
        // assert.ok(!sessionResults.getStartInfo().getDefaultMatchSettings().getIgnoreDisplacements(), browserInfo);
        // assert.strictEqual(MatchLevel.Strict, sessionResults.getStartInfo().getDefaultMatchSettings().MatchLevel, browserInfo);
        //
        // assert.strictEqual(2, sessionResults.getActualAppOutput().length, browserInfo);
        //
        // assert.strictEqual(AccessibilityLevel.AAA, sessionResults.getActualAppOutput()[0].getImageMatchSettings().AccessibilityLevel, browserInfo);
        // assert.ok(sessionResults.getActualAppOutput()[0].getImageMatchSettings().getIgnoreDisplacements(), browserInfo);
        // assert.strictEqual(MatchLevel.Strict, sessionResults.getActualAppOutput()[0].getImageMatchSettings().MatchLevel, browserInfo);
        //
        // assert.strictEqual(AccessibilityLevel.AA, sessionResults.getActualAppOutput()[1].getImageMatchSettings().AccessibilityLevel, browserInfo);
        // assert.ok(sessionResults.getActualAppOutput()[1].getImageMatchSettings().getIgnoreDisplacements(), browserInfo);
        // assert.strictEqual(MatchLevel.Layout2, sessionResults.getActualAppOutput()[1].getImageMatchSettings().MatchLevel, browserInfo);
      }
    } finally {
      driver.quit();
    }
  });
});
