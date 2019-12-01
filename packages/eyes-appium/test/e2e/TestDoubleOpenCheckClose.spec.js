'use strict';

const { Builder, Capabilities } = require('selenium-webdriver');
const { Eyes, Target } = require('../../index');
const { TestDataProvider } = require('./TestDataProvider');
const { TestUtils } = require('./TestUtils');

describe('TestDoubleOpenCheckClose', function () {
  this.timeout(5 * 60 * 1000);

  async function _runOnAndroid(eyes) {
    const options = new Capabilities();
    options.set('name', 'Open Check Close X2 (A)');
    options.set('username', TestDataProvider.SAUCE_USERNAME);
    options.set('accesskey', TestDataProvider.SAUCE_ACCESS_KEY);
    options.set('deviceName', 'Samsung Galaxy Tab S3 GoogleAPI Emulator');
    options.set('deviceOrientation', 'landscape');
    options.set('platformName', 'Android');
    options.set('platformVersion', '8.1');
    options.set('browserName', 'Chrome');

    const driver = new Builder()
      .usingServer(TestDataProvider.SAUCE_SELENIUM_URL)
      .withCapabilities(options)
      .build();

    try {
      const eyesDriver = await eyes.open(driver, 'Applitools', 'Open Check Close X2 SauceLabs (A)');
      await eyesDriver.get('https://www.applitools.com');
      await eyes.check('Test Android', Target.window().sendDom(false));
      await eyes.close(false);
    } finally {
      // Close the browser.
      await driver.quit();

      // If the test was aborted before eyes.Close was called, ends the test as aborted.
      await eyes.abort();
    }
  }

  async function _runOnIos(eyes) {
    const options = new Capabilities();
    options.set('name', 'Open Check Close X2 (A)');
    options.set('username', TestDataProvider.SAUCE_USERNAME);
    options.set('accesskey', TestDataProvider.SAUCE_ACCESS_KEY);
    options.set('deviceName', 'iPad Simulator');
    options.set('deviceOrientation', 'portrait');
    options.set('platformName', 'iOS');
    options.set('platformVersion', '12.2');
    options.set('browserName', 'Safari');

    const driver = new Builder()
      .usingServer(TestDataProvider.SAUCE_SELENIUM_URL)
      .withCapabilities(options)
      .build();

    try {
      const eyesDriver = await eyes.open(driver, 'Applitools', 'Open Check Close X2 SauceLabs (A)');
      await eyesDriver.get('https://www.google.com');
      await eyes.check('Test iOS', Target.window().sendDom(false));
      await eyes.close(false);
    } finally {
      // Close the browser.
      await driver.quit();

      // If the test was aborted before eyes.Close was called, ends the test as aborted.
      await eyes.abort();
    }
  }

  it('TestDoubleOpenCheckCloseOnSauceLabs', async function () {
    const eyes = new Eyes();
    TestUtils.setupLogging(eyes);
    eyes.setSendDom(false);
    eyes.setBatch(TestDataProvider.BatchInfo);

    await _runOnAndroid(eyes);
    await _runOnIos(eyes);
  });
});
