'use strict';

const assert = require('assert');
const { ReportingTestSuite } = require('../ReportingTestSuite');
const { SeleniumUtils } = require('../Utils/SeleniumUtils');
const { TestDataProvider } = require('../TestDataProvider');
const { Eyes, Target, RectangleSize, Configuration, VisualGridRunner } = require('../../../index');

describe('HelloWorldTest', function () {
  this.timeout(5 * 60 * 1000);

  const /** @type {ReportingTestSuite} */ testSetup = new ReportingTestSuite();
  before(async function () { await testSetup.oneTimeSetup(); });
  beforeEach(async function () { await testSetup.setup(this); });
  afterEach(async function () { await testSetup.tearDown(this); });
  after(async function () { await testSetup.oneTimeTearDown(); });

  /**
   * @param {EyesRunner} runner
   * @param {IWebDriver} driver
   * @param {RectangleSize} viewport
   * @param {string} testName
   * @return {Eyes}
   * @private
   */
  function _initEyes(runner, driver, viewport, testName) {
    const eyes = new Eyes(runner);

    const sconf = new Configuration();
    sconf.setBatch(TestDataProvider.BatchInfo);
    sconf.setViewportSize(viewport);
    sconf.setTestName(testName).setAppName('TestRendersMatch');
    eyes.setConfiguration(sconf);
    eyes.open(driver);
    return eyes;
  }

  it('TestSuccess', async function () {
    const visualGridRunner = new VisualGridRunner(10);
    // TODO: not implemented
    // visualGridRunner.setLogHandler(TestUtils.initLogHandler());

    const ViewportList = [
      new RectangleSize(800, 600),
      new RectangleSize(700, 500),
      new RectangleSize(1200, 800),
      new RectangleSize(1600, 1200),
    ];

    const webDriver = SeleniumUtils.createChromeDriver();
    await webDriver.get('https://applitools.com/helloworld');
    let eyes;
    try {
      for (const viewport of ViewportList) {
        eyes = _initEyes(null, webDriver, viewport, this.test.title);
        await eyes.check(null, Target.window().fully());
        await eyes.closeAsync();

        eyes = _initEyes(visualGridRunner, webDriver, viewport, this.test.title);
        await eyes.check(null, Target.window().fully());
        await eyes.closeAsync();
      }
      const results = await visualGridRunner.getAllTestResults();
      assert.strictEqual(ViewportList.length, results.getAllResults().length);
    } finally {
      await webDriver.quit();
      await eyes.abort();
    }
  });

  it('TestFailure', async function () {
    const visualGridRunner = new VisualGridRunner(10);
    // TODO: not implemented
    // visualGridRunner.setLogHandler(TestUtils.initLogHandler());

    const ViewportList = [
      new RectangleSize(800, 600),
      new RectangleSize(700, 500),
      new RectangleSize(1200, 800),
      new RectangleSize(1600, 1200),
    ];

    const webDriver = SeleniumUtils.createChromeDriver();
    await webDriver.get('https://applitools.com/helloworld');
    let eyes;
    try {
      let resultsTotal = 0;
      for (const viewport of ViewportList) {
        eyes = _initEyes(null, webDriver, viewport, this.test.title);
        await eyes.check(null, Target.window().fully());
        await eyes.close();

        eyes = _initEyes(visualGridRunner, webDriver, viewport, this.test.title);
        await eyes.check(null, Target.window().fully());
        await eyes.close();
        const results = await visualGridRunner.getAllTestResults();
        resultsTotal += results.getAllResults().length;
      }
      assert.strictEqual(4, resultsTotal);
    } finally {
      await webDriver.quit();
      await eyes.abort();
    }
  });
});
