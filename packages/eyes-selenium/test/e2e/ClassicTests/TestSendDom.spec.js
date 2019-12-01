'use strict';

const assert = require('assert');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { By } = require('selenium-webdriver');
const { DomCapture } = require('@applitools/dom-utils');

const { ReportingTestSuite } = require('../ReportingTestSuite');
const { TestUtils } = require('../Utils/TestUtils');
const { SeleniumUtils } = require('../Utils/SeleniumUtils');
const { TestDataProvider } = require('../TestDataProvider');
const { Eyes, Target, RectangleSize, Logger, EyesSelenium } = require('../../../index');

describe('TestSendDom', function () {
  this.timeout(5 * 60 * 1000);

  const /** @type {ReportingTestSuite} */ testSetup = new ReportingTestSuite();
  before(async function () { await testSetup.oneTimeSetup(); });
  beforeEach(async function () { await testSetup.setup(this); });
  afterEach(async function () { await testSetup.tearDown(this); });
  after(async function () { await testSetup.oneTimeTearDown(); });

  /**
   * @param {EyesSelenium} eyes
   * @param {TestResults} results
   * @return {boolean}
   * @private
   */
  async function _getHasDom(eyes, results) {
    const sessionResults = await TestUtils.getSessionResults(eyes.getApiKey(), results);
    const actualAppOutputs = sessionResults.getActualAppOutput();
    assert.strictEqual(1, actualAppOutputs.length);
    const hasDom = actualAppOutputs[0].getImage().getHasDom();
    return hasDom;
  }

  /**
   * @param {string} url
   * @param {string} testName
   * @private
   */
  async function _captureDom(url, testName) {
    const webDriver = SeleniumUtils.createChromeDriver();
    await webDriver.get(url);
    const logger = new Logger();
    logger.setLogHandler(TestUtils.initLogHandler(testName));
    const eyes = new Eyes();
    try {
      eyes.setBatch(TestDataProvider.BatchInfo);
      eyes.setAppName('Test Send DOM');
      eyes.setTestName(testName);
      const eyesWebDriver = await eyes.open(webDriver);
      // const domCapture = new DomCapture(logger, eyesWebDriver);
      await eyes.checkWindow();
      const results = await eyes.close(false);
      const hasDom = await _getHasDom(eyes, results);
      assert.ok(hasDom);
      // const actualDomJsonString = domCapture.getFullWindowDom();
      // WriteDomJson(logger, actualDomJsonString);
    } catch (err) {
      logger.log('Error: ', err);
      // throw err;
    } finally {
      eyes.abort();
      webDriver.quit();
    }
  }

  /**
   * @param {string} fileName
   * @return {Promise<object>}
   */
  async function getExpectedDom(fileName) {
    const expectedDomBuffer = await fs.readFileSync(path.join(__dirname, `../../fixtures/${fileName}`));
    return JSON.parse(expectedDomBuffer);
  }

  /**
   * @param {string} url
   * @return {Promise<object>}
   */
  async function getExpectedDomFromUrl(url) {
    const expectedDomBuffer = await axios.get(url);
    return expectedDomBuffer.data;
  }

  class DomInterceptingEyes extends EyesSelenium {
    /**
     * @inheritDoc
     */
    async tryCaptureDom() {
      this._domJson = await super.tryCaptureDom();
      return this._domJson;
    }

    getDomJson() {
      return this._domJson;
    }
  }

  it('TestSendDOM_FullWindow', async function () {
    const webDriver = SeleniumUtils.createChromeDriver();
    await webDriver.get('https://applitools.github.io/demo/TestPages/FramesTestPage/');
    const eyes = new DomInterceptingEyes();
    eyes.setBatch(TestDataProvider.BatchInfo);

    const eyesWebDriver = await eyes.open(webDriver, 'Test Send DOM', 'Full Window', new RectangleSize(1024, 768));
    try {
      await eyes.check('Window', Target.window().fully());
      const actualDomJson = eyes.getDomJson();
      const expectedDomJson = await getExpectedDom('expected_dom1.json');
      const results = await eyes.close(false);
      const hasDom = await _getHasDom(eyes, results);
      assert.ok(hasDom);

      assert.deepStrictEqual(expectedDomJson, actualDomJson);
    } finally {
      await eyes.abort();
      await webDriver.quit();
    }
  });

  it('TestSendDOM_Simple_HTML', async function () {
    const webDriver = SeleniumUtils.createChromeDriver();
    webDriver.Url = 'https://applitools-dom-capture-origin-1.surge.sh/test.html';
    const eyes = new Eyes();
    try {
      const eyesWebDriver = await eyes.open(webDriver, 'Test Send DOM', 'Test DomCapture method', new RectangleSize(1200, 1000));
      const logger = new Logger();
      logger.setLogHandler(TestUtils.initLogHandler());
      const actualDomJson = await DomCapture.getFullWindowDom(logger, eyesWebDriver);
      const expectedDomJson = await getExpectedDomFromUrl('https://applitools-dom-capture-origin-1.surge.sh/test.dom.json');

      await eyes.close(false);
      assert.deepStrictEqual(expectedDomJson, actualDomJson);
    } finally {
      await eyes.abort();
      await webDriver.quit();
    }
  });

  it('TestSendDOM_Selector', async function () {
    const webDriver = SeleniumUtils.createChromeDriver();
    await webDriver.get('https://applitools.github.io/demo/TestPages/DomTest/dom_capture.html');
    const eyes = new Eyes();
    eyes.setBatch(TestDataProvider.BatchInfo);
    try {
      await eyes.open(webDriver, 'Test SendDom', 'Test SendDom', new RectangleSize(1000, 700));
      await eyes.check('region', Target.region(By.css('#scroll1')));
      const results = await eyes.close(false);
      const hasDom = await _getHasDom(eyes, results);
      assert.ok(hasDom);
    } finally {
      await eyes.abort();
      await webDriver.quit();
    }
  });

  it('TestNotSendDOM', async function () {
    const webDriver = SeleniumUtils.createChromeDriver();
    await webDriver.get('https://applitools.com/helloworld');
    const eyes = new Eyes();
    eyes.setBatch(TestDataProvider.BatchInfo);
    eyes.setLogHandler(TestUtils.initLogHandler());
    eyes.setSendDom(false);
    try {
      await eyes.open(webDriver, 'Test NOT SendDom', 'Test NOT SendDom', new RectangleSize(1000, 700));
      await eyes.check('window', Target.window().sendDom(false));
      const results = await eyes.close(false);
      const hasDom = await _getHasDom(eyes, results);
      assert.ok(!hasDom);
    } finally {
      await eyes.abort();
      await webDriver.quit();
    }
  });

  it('TestSendDOM_1', async function () {
    await _captureDom('https://applitools.github.io/demo/TestPages/DomTest/dom_capture.html', this.test.title);
  });

  it('TestSendDOM_2', async function () {
    await _captureDom('https://applitools.github.io/demo/TestPages/DomTest/dom_capture_2.html', this.test.title);
  });
});
