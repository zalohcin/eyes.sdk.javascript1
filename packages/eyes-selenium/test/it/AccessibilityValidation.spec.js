'use strict';

require('chromedriver');
const { Builder, By } = require('selenium-webdriver');
const { Options: ChromeOptions } = require('selenium-webdriver/chrome');
const {
  Eyes,
  VisualGridRunner,
  ClassicRunner,
  Target,
  Configuration,
  BrowserType,
  AccessibilityLevel,
  AccessibilityRegionType,
  BatchInfo,
} = require('../../index');

let /** @type {WebDriver} */ driver, configuration;
describe('AccessibilityValidation', () => {
  const batch = new BatchInfo();

  beforeEach(async () => {
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(new ChromeOptions().headless())
      .build();
    configuration = new Configuration();
    configuration.setBatch(batch);
  });

  it('VisualGridTest', async function () {
    await driver.get('https://applitools.com/helloworld');

    const eyes = new Eyes(new VisualGridRunner());

    configuration.addBrowser(800, 600, BrowserType.CHROME);
    configuration.addBrowser(700, 500, BrowserType.CHROME);
    configuration.addBrowser(400, 300, BrowserType.CHROME);

    // set accessibility
    configuration.setAccessibilityValidation(AccessibilityLevel.AAA);
    eyes.setConfiguration(configuration);

    await eyes.open(driver, this.test.parent.title, this.test.title);

    await eyes.check(
      'Main Page',
      Target.window().accessibilityRegion(By.css('button'), AccessibilityRegionType.RegularText)
    );

    // close all test and close batch request
    const results = await eyes.getRunner().getAllTestResults(); // eslint-disable-line
  });

  it('ClassicTest', async function () {
    await driver.get('https://applitools.com/helloworld');

    const eyes = new Eyes(new ClassicRunner());

    // set accessibility
    configuration.setAccessibilityValidation(AccessibilityLevel.AA);
    eyes.setConfiguration(configuration);

    await eyes.open(driver, this.test.parent.title, this.test.title);

    await eyes.check(
      'Main Page',
      Target.window().accessibilityRegion(By.css('button'), AccessibilityRegionType.BoldText)
    );

    await eyes.closeAsync();

    // close all test and close batch request
    const results = await eyes.getRunner().getAllTestResults(); // eslint-disable-line
  });

  afterEach(async () => {
    if (driver != null) {
      await driver.quit();
    }
  });
});
