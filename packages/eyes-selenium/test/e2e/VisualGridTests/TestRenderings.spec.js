'use strict';

const assert = require('assert');
const { Eyes, Target, VisualGridRunner, Configuration, BrowserType, DeviceName, StitchMode, MatchLevel } = require('../../../index');
const { SeleniumUtils } = require('../Utils/SeleniumUtils');
const { TestUtils } = require('../Utils/TestUtils');
const { TestDataProvider } = require('../TestDataProvider');

describe('TestRenderings', function () {
  this.timeout(5 * 60 * 1000);

  it('TestMobileOnly', async function () {
    const runner = new VisualGridRunner(30);
    const eyes = new Eyes(runner);

    eyes.setLogHandler(TestUtils.initLogHandler());

    const sconf = new Configuration();
    sconf.setTestName('Mobile Render Test');
    sconf.setAppName('Visual Grid Render Test');
    sconf.setBatch(TestDataProvider.BatchInfo);

    sconf.addDeviceEmulation(DeviceName.Galaxy_S5);

    eyes.setConfiguration(sconf);
    const driver = SeleniumUtils.createChromeDriver();
    await eyes.open(driver);
    await driver.get('https://applitools.github.io/demo/TestPages/DynamicResolution/mobile.html');
    await eyes.check('Test Mobile Only', Target.window().fully());
    await driver.quit();
    await eyes.close();
    const allResults = await runner.getAllTestResults();
  });

  it('ViewportsTest', async function () {
    const runner = new VisualGridRunner(30);
    const eyes = new Eyes(runner);

    eyes.setLogHandler(TestUtils.initLogHandler());

    const sconf = new Configuration();
    sconf.setBatch(TestDataProvider.BatchInfo);
    sconf.setTestName('Viewport Size Test');
    sconf.setAppName('Visual Grid Viewports Test');
    sconf.setHideScrollbars(true);
    sconf.setStitchMode(StitchMode.CSS);
    sconf.setForceFullPageScreenshot(true);
    sconf.setMatchLevel(MatchLevel.Strict);

    sconf.addBrowser(800, 600, BrowserType.CHROME);
    sconf.addBrowser(700, 500, BrowserType.CHROME);
    sconf.addBrowser(1200, 800, BrowserType.CHROME);
    sconf.addBrowser(1600, 1200, BrowserType.CHROME);
    sconf.addBrowser(800, 600, BrowserType.FIREFOX);
    sconf.addBrowser(700, 500, BrowserType.FIREFOX);
    sconf.addBrowser(1200, 800, BrowserType.FIREFOX);
    sconf.addBrowser(1600, 1200, BrowserType.FIREFOX);
    sconf.addBrowser(800, 600, BrowserType.EDGE);
    sconf.addBrowser(700, 500, BrowserType.EDGE);
    sconf.addBrowser(1200, 800, BrowserType.EDGE);
    // sconf.addBrowser(1600, 1200, BrowserType.EDGE);
    sconf.addBrowser(800, 600, BrowserType.IE_11);
    sconf.addBrowser(700, 500, BrowserType.IE_11);
    sconf.addBrowser(1200, 800, BrowserType.IE_11);
    // sconf.addBrowser(1600, 1200, BrowserType.IE_11);
    sconf.addBrowser(800, 600, BrowserType.IE_10);
    sconf.addBrowser(700, 500, BrowserType.IE_10);
    sconf.addBrowser(1200, 800, BrowserType.IE_10);
    // sconf.addBrowser(1600, 1200, BrowserType.IE_10);
    eyes.setConfiguration(sconf);

    const driver = SeleniumUtils.createChromeDriver();
    await eyes.open(driver);
    await driver.get('https://www.applitools.com');
    await eyes.check('Test Viewport', Target.window().fully());
    await driver.quit();

    const allResults = await runner.getAllTestResults(false);
    assert.ok(sconf.getBrowsersInfo().length > Object.values(BrowserType).length);
    assert.ok(sconf.getBrowsersInfo().length > allResults.getAllResults().length);

    const results = new Map();
    for (const testResultContainer of allResults) {
      assert.ok(testResultContainer, 'testResultContainer');

      const sessionResults = await TestUtils.getSessionResults(eyes.getApiKey(), testResultContainer.getTestResults());
      if (!sessionResults) {
        eyes.getLogger().log(`Error: sessionResults is null for item ${testResultContainer}`);
        continue; // eslint-disable-line no-continue
      }

      const env = sessionResults.getEnv();
      const browser = env.getHostingAppInfo();
      if (!browser) {
        eyes.getLogger().log(`Error: HostingAppInfo (browser) is null. ${testResultContainer}`);
        continue; // eslint-disable-line no-continue
      }

      let sizesList;
      if (!results.get(browser)) {
        sizesList = new Set();
        results.add(browser, sizesList);
      }

      const displaySize = env.getDisplaySize();
      if (sizesList.has(displaySize)) {
        assert.fail(`Browser ${browser} viewport size ${displaySize} already exist in results.`);
      }

      sizesList.add(displaySize);
    }
    assert.strictEqual(5, results.length);
  });

  [
    { url: 'https://applitools.github.io/demo/TestPages/DomTest/shadow_dom.html', testName: 'Shadow DOM Test' },
    { url: 'https://applitools.github.io/demo/TestPages/VisualGridTestPage/canvastest.html', testName: 'Canvas Test' },
  ].forEach(({ url, testName }) => {
    describe(`url: ${url}, testName: ${testName}`, function () {
      it('TestSpecialRendering', async function () {
        const runner = new VisualGridRunner(30);

        const logsPath = TestUtils.initLogPath('TestSpecialRendering');
        // runner.setDebugResourceWriter(new FileDebugResourceWriter(logsPath));

        const eyes = new Eyes(runner);
        eyes.setLogHandler(TestUtils.initLogHandler(logsPath));

        const sconf = new Configuration();
        sconf.setTestName(testName);
        sconf.setAppName('Visual Grid Render Test');
        sconf.setBatch(TestDataProvider.BatchInfo);

        sconf.addDeviceEmulation(DeviceName.Galaxy_S5);
        sconf.addBrowser(1200, 800, BrowserType.CHROME);
        sconf.addBrowser(1200, 800, BrowserType.FIREFOX);

        // Edge doesn't support Shadow-DOM - returns an empty image.
        // sconf.addBrowser(1200, 800, BrowserType.EDGE);

        // Internet Explorer doesn't support Shadow-DOM - fails to render and throws an error.
        // sconf.addBrowser(1200, 800, BrowserType.IE_11);
        // sconf.addBrowser(1200, 800, BrowserType.IE_10);

        eyes.setConfiguration(sconf);
        const driver = SeleniumUtils.createChromeDriver();
        await eyes.open(driver);
        await driver.get(url);
        await driver.sleep(500);
        await eyes.check(testName, Target.window().fully());
        await driver.quit();
        await eyes.close(false);
        const allResults = await runner.getAllTestResults(false);// TODO - this never ends!
      });
    });
  });
});
