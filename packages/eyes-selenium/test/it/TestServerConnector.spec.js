'use strict';

require('chromedriver');
const { Builder, Capabilities } = require('selenium-webdriver');
const { Options: ChromeOptions } = require('selenium-webdriver/chrome');
const { RectangleSize } = require('@applitools/eyes-sdk-core');
const { Eyes, Target } = require('../../index');

let /** @type {WebDriver} */ driver, /** @type {Eyes} */ eyes;
describe('TestServerConnector', function () {
  this.timeout(5 * 60 * 1000);

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

  it('TestServerConnector', async function () {
    await eyes.open(driver, this.test.parent.title, this.test.title, new RectangleSize({ width: 800, height: 599 }));

    await driver.get('https://applitools.com/helloworld');

    await eyes.check('Hello', Target.window());

    const results = await eyes.close();

    await results.delete();
  });

  afterEach(async function () {
    await driver.quit();
    await eyes.abortIfNotClosed();
  });
});
