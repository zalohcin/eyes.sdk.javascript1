'use strict';

require('chromedriver');
const assert = require('assert');

const { Builder, Capabilities } = require('selenium-webdriver');
const { Options: ChromeOptions } = require('selenium-webdriver/chrome');
const { RectangleSize } = require('@applitools/eyes-sdk-core');

const { Eyes, EyesWebDriver, Target } = require('../../index');
const { throwsAsync } = require('../utils');

let driver, eyes;
describe('Eyes', function () {
  this.timeout(60 * 1000);

  before(async function () {
    const chromeOptions = new ChromeOptions();
    chromeOptions.addArguments('disable-infobars');
    chromeOptions.headless();
    driver = await new Builder()
      .withCapabilities(Capabilities.chrome())
      .setChromeOptions(chromeOptions)
      .build();

    eyes = new Eyes();
  });

  describe('#open()', function () {
    it('should return EyesWebDriver', async function () {
      driver = await eyes.open(driver, this.test.parent.title, this.test.title, new RectangleSize(800, 560));
      assert.equal(driver instanceof EyesWebDriver, true);
      await eyes.close();
    });

    it('should throw IllegalState: Eyes not open', async function () {
      await throwsAsync(async () => eyes.check('test', Target.window()), 'IllegalState: Eyes not open');
    });
  });

  afterEach(async function () {
    await eyes.abortIfNotClosed();
  });

  after(async function () {
    await driver.quit();
  });
});
