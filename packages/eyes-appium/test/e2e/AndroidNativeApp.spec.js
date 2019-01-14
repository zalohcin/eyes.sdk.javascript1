'use strict';

const { Builder, Capabilities, By } = require('selenium-webdriver');
const { ConsoleLogHandler } = require('@applitools/eyes-sdk-core');
const { Eyes, Target } = require('../../index');

let /** @type WebDriver */ driver, /** @type Eyes */ eyes;
describe('AndroidNativeApp', function () {
  this.timeout(5 * 60 * 1000);

  before(async function () {
    const cp = new Capabilities();
    cp.set('platformName', 'Android');
    cp.set('platformVersion', '7.0');
    cp.set('deviceName', 'Android Emulator');
    cp.set('automationName', 'uiautomator2');
    cp.set('app', 'https://applitools.bintray.com/Examples/app-debug.apk');
    cp.set('appPackage', 'com.applitoolstest');
    cp.set('appActivity', 'com.applitoolstest.ScrollActivity');
    cp.set('newCommandTimeout', 600);

    const seleniumServer = 'http://127.0.0.1:4723/wd/hub';
    // const seleniumServer = `https://${process.env.SAUCE_USERNAME}:${process.env.SAUCE_ACCESS_KEY}@ondemand.saucelabs.com:443/wd/hub`;

    // Open the app.
    driver = await new Builder()
      .withCapabilities(cp)
      .usingServer(seleniumServer)
      .build();

    // Initialize the eyes SDK and set your private API key.
    eyes = new Eyes();
    eyes.setLogHandler(new ConsoleLogHandler(true));
    // eyes.setSaveDebugScreenshots(true);
    // eyes.setForceFullPageScreenshot(true);
  });

  beforeEach(async function () {
    driver = await eyes.open(driver, this.test.parent.title, this.currentTest.title);
  });

  it('Basic window', async function () {
    await eyes.check(this.test.title, Target.window());

    return eyes.close(false);
  });

  it('Region of window', async function () {
    const scrollableElement = await driver.findElement(new By('-android uiautomator', 'new UiSelector().scrollable(true)'));
    await eyes.check(this.test.title, Target.region(scrollableElement).ignoreRegions(scrollableElement));

    return eyes.close(false);
  });

  afterEach(async function () {
    await eyes.abortIfNotClosed();
  });

  after(async function () {
    await driver.quit();
  });
});
