'use strict';

require('chromedriver');
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const dateformat = require('dateformat');
const { Builder, By } = require('selenium-webdriver');
const { Options: ChromeOptions } = require('selenium-webdriver/chrome');

const { Logger, ConsoleLogHandler, FileLogHandler } = require('@applitools/eyes.sdk.core');
const { DomCapture } = require('../index');

/**
 * @param {Logger} logger_
 * @param {string} domJson
 * @param {string} testName
 */
function writeDomJson(logger_, domJson, testName) {
  const fileLogger = logger_.getLogHandler();
  if (fileLogger instanceof FileLogHandler) {
    const pathName = path.dirname(path.normalize(fileLogger._filename));
    fs.writeFileSync(path.join(pathName, `${testName}.json`), domJson);
  }
}

/**
 * @param {Logger} logger_
 * @param {WebDriver} driver_
 * @param {string} url
 * @param {string} testName
 * @param {function} [initCode]
 * @return {Promise<string>}
 */
async function captureDom(logger_, driver_, url, testName, initCode) {
  try {
    await driver_.get(url);

    if (initCode) {
      await initCode(driver_);
    }

    const actualDomJsonString = await DomCapture.getFullWindowDom(logger_, driver_);
    writeDomJson(logger_, actualDomJsonString, testName);

    return actualDomJsonString;
  } catch (err) {
    logger_.log(`Error: ${err}`);
    throw err;
  }
}

/**
 * @param {string} testName
 * @return {Promise<object>}
 */
async function getExpectedDom(testName) {
  const expectedDomBuffer = await fs.readFileSync(path.join(__dirname, `./resources/${testName}.json`));
  return JSON.parse(expectedDomBuffer);
}

/**
 * @param {string} domUrl
 * @return {Promise<string>}
 */
async function getExpectedDomFromUrl(domUrl) {
  const response = await axios(domUrl);
  return response.data;
}

let /** @type {Logger} */ logger, /** @type {ChromeOptions} */ chromeOptions, /** @type {WebDriver} */ driver;
describe('DomCapture', function () {
  this.timeout(60 * 1000);

  before(function () {
    chromeOptions = new ChromeOptions().headless();

    logger = new Logger();
    // if (process.env.CI) {
    logger.setLogHandler(new ConsoleLogHandler(true));
    // } else {
    //   const dateString = dateformat(new Date(), 'yyyy_mm_dd_HH_MM_ss_l');
    //   const extendedTestName = `${this.test.parent.title}_${dateString}`;
    //   const logsPath = process.env.APPLITOOLS_LOGS_PATH || '.';
    //   const pathName = path.join(logsPath, 'JavaScript', extendedTestName);
    //   logger.setLogHandler(new FileLogHandler(true, path.join(pathName, 'log.log')));
    //   logger.getLogHandler().open();
    // }
  });

  beforeEach(async function () {
    driver = await new Builder().forBrowser('chrome').setChromeOptions(chromeOptions).build();
    await driver.manage().window().setRect({ x: 0, y: 0, width: 800, height: 600 });
  });

  it('TestSendDOM_Simple_HTML', async function () {
    const actualDomJsonString = await captureDom(logger, driver, 'https://applitools-dom-capture-origin-1.surge.sh/test.html', this.test.title);
    const actualDomJson = JSON.parse(actualDomJsonString);

    const expectedDomJson = await getExpectedDom(this.test.title);
    assert.deepEqual(actualDomJson, expectedDomJson);
  });

  it('TestSendDOM_1', async function () {
    const actualDomJsonString = await captureDom(logger, driver, 'http://applitools.github.io/demo/TestPages/DomTest/dom_capture.html', this.test.title);
    const actualDomJson = JSON.parse(actualDomJsonString);

    const expectedDomJson = await getExpectedDom(this.test.title);
    assert.deepEqual(actualDomJson, expectedDomJson);
  });

  it('TestSendDOM_2', async function () {
    const actualDomJsonString = await captureDom(logger, driver, 'http://applitools.github.io/demo/TestPages/DomTest/dom_capture_2.html', this.test.title);
    const actualDomJson = JSON.parse(actualDomJsonString);

    const expectedDomJson = await getExpectedDom(this.test.title);
    assert.deepEqual(actualDomJson, expectedDomJson);
  });

  it('TestSendDOM_Booking1', async function () {
    const actualDomJsonString = await captureDom(logger, driver, 'https://www.booking.com/searchresults.en-gb.html?label=gen173nr-1FCAEoggJCAlhYSDNYBGhqiAEBmAEuwgEKd2luZG93cyAxMMgBDNgBAegBAfgBC5ICAXmoAgM;sid=ce4701a88873eed9fbb22893b9c6eae4;city=-2600941;from_idr=1&;ilp=1;d_dcp=1', this.test.title);
    const actualDomJson = JSON.parse(actualDomJsonString);

    const expectedDomJson = await getExpectedDom(this.test.title);
    assert.deepEqual(actualDomJson, expectedDomJson);
  });

  it('TestSendDOM_Booking2', async function () {
    const actualDomJsonString = await captureDom(logger, driver, 'https://booking.kayak.com/flights/TLV-MIA/2018-09-25/2018-10-31?sort=bestflight_a', this.test.title);
    const actualDomJson = JSON.parse(actualDomJsonString);

    const expectedDomJson = await getExpectedDom(this.test.title);
    assert.deepEqual(actualDomJson, expectedDomJson);
  });

  it('TestSendDOM_BestBuy1', async function () {
    const actualDomJsonString = await captureDom(logger, driver, 'https://www.bestbuy.com/site/apple-macbook-pro-13-display-intel-core-i5-8-gb-memory-256gb-flash-storage-silver/6936477.p?skuId=6936477', this.test.title, async driver => {
      await driver.findElement(By.css('.us-link')).click();
    });
    const actualDomJson = JSON.parse(actualDomJsonString);

    const expectedDomJson = await getExpectedDom(this.test.title);
    assert.deepEqual(actualDomJson, expectedDomJson);
  });

  afterEach(async function () {
    await driver.quit();
  });

  after(async function () {
    logger.getLogHandler().close();
  });
});
