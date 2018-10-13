'use strict';

require('chromedriver');
const { Builder, Capabilities } = require('selenium-webdriver');
const { Options: ChromeOptions } = require('selenium-webdriver/chrome');
const { RectangleSize, DiffsFoundError, GeneralUtils, NewTestError } = require('@applitools/eyes.sdk.core');
const { Eyes, Target } = require('../../index');
const { TestUtils } = require('../TestUtils');

let driver, eyes;
describe('TestServerStatus', function () {
  this.timeout(5 * 60 * 1000);

  before(async function () {
    const chromeOptions = new ChromeOptions();
    chromeOptions.addArguments('disable-infobars');

    const caps = Capabilities.chrome();
    caps.set('username', process.env.SAUCE_USERNAME);
    caps.set('accesskey', process.env.SAUCE_ACCESS_KEY);
    // noinspection JSCheckFunctionSignatures
    driver = await new Builder()
      .withCapabilities(caps)
      .setChromeOptions(chromeOptions)
      .usingServer(process.env.SELENIUM_SERVER_URL)
      .build();

    eyes = new Eyes();
    eyes.setSaveNewTests(false);
  });

  it('TestSessionSummary_Status_Failed', async function () {
    driver = await eyes.open(driver, this.test.parent.title, this.test.title, new RectangleSize(800, 599));

    await driver.get('http://applitools.github.io/demo/TestPages/FramesTestPage/');

    await eyes.check('TestSessionSummary_Status_Failed', Target.window());

    await TestUtils.throwsAsync(async () => eyes.close(), DiffsFoundError, 'Expected DiffsFoundError');
  });

  it('TestSessionSummary_Status_New', async function () {
    const uuid = GeneralUtils.guid();
    driver = await eyes.open(driver, this.test.parent.title, this.test.title + uuid, new RectangleSize(800, 599));

    await driver.get('http://applitools.github.io/demo/TestPages/FramesTestPage/');

    await eyes.check('TestSessionSummary_Status_New', Target.window());

    await TestUtils.throwsAsync(async () => eyes.close(), NewTestError, 'Expected NewTestError');
  });

  afterEach(async function () {
    await eyes.abortIfNotClosed();
  });

  after(async function () {
    await driver.quit();
  });
});
