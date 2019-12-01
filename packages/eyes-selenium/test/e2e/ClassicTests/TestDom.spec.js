'use strict';

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { DomCapture } = require('@applitools/dom-utils');
const { Eyes, Configuration, RectangleSize } = require('../../../index');
const { SeleniumUtils } = require('../Utils/SeleniumUtils');
const { TestUtils } = require('../Utils/TestUtils');
const { TestDataProvider } = require('../TestDataProvider');

describe('TestDom', function () {
  this.timeout(5 * 60 * 1000);

  /**
   * @param {string} testName
   * @return {Promise<object>}
   */
  async function getExpectedDom(testName) {
    const expectedDomBuffer = await fs.readFileSync(path.join(__dirname, `../../fixtures/${testName}.json`));
    return JSON.parse(expectedDomBuffer);
  }

  it('TestDomSerialization', async function () {
    const expectedDomJson = await getExpectedDom('ExpectedDom_CorsTestPage');
    const driver = SeleniumUtils.createChromeDriver();
    const eyes = new Eyes();
    const conf = new Configuration();
    conf.setAppName('app');
    conf.setTestName('test');
    conf.setViewportSize(new RectangleSize(800, 600));
    conf.setHideScrollbars(true);
    conf.setBatch(TestDataProvider.BatchInfo);
    eyes.setConfiguration(conf);
    eyes.setLogHandler(TestUtils.initLogHandler('TestDom'));

    const eyesWebDriver = await eyes.open(driver);
    await driver.get('https://applitools.github.io/demo/TestPages/CorsTestPage/');
    await driver.sleep(2000);
    try {
      const json = await DomCapture.getFullWindowDom(eyes.getLogger(), eyesWebDriver);

      const actualDomJson = JSON.parse(json);

      assert.deepStrictEqual(actualDomJson, expectedDomJson);
    } finally {
      await eyes.abort();
      await driver.quit();
    }
  });
});
