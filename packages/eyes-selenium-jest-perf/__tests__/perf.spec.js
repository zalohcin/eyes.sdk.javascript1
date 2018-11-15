'use strict';

require('chromedriver');
const { PerformanceUtils } = require('@applitools/eyes-sdk-core');
const { Eyes } = require('@applitools/eyes-selenium');
const { Builder, Capabilities } = require('selenium-webdriver');
const { Options: ChromeOptions } = require('selenium-webdriver/chrome');

jest.setTimeout(3000000);

describe('performance tests', () => {
  let driver, eyes;

  beforeEach(async () => {
    const chromeOptions = new ChromeOptions();
    chromeOptions.addArguments('disable-infobars');
    driver = await (new Builder()
      .withCapabilities(Capabilities.chrome())
      .setChromeOptions(chromeOptions))
      .build();
    eyes = new Eyes();
  });

  afterEach(async () => {
    if (eyes._isOpen) {
      await eyes.close();
    }
    await driver.quit();
  });

  it('should run the test case fast', async () => {
    const startDate = PerformanceUtils.start();
    // eslint-disable-next-line no-undef
    const _driver = await eyes.open(driver, 'js sdk tests', 'window full perf');
    await _driver.get('https://applitools.com/helloworld');
    await eyes.setViewportSize({
      width: 1280,
      height: 800,
    });
    eyes.setForceFullPageScreenshot(true);
    await eyes.checkWindow('check full page');
    expect(startDate.end().time).toBeLessThanOrEqual(8000);
  });
});
