'use strict';

const { Builder, Capabilities } = require('selenium-webdriver');
const { Eyes, Target, BatchInfo, FileLogHandler, FileDebugScreenshotsProvider, FixedCutProvider } = require('../../index');
const { TestDataProvider } = require('./TestDataProvider');

describe('TestAppium_RealDevice', function () {
  this.timeout(5 * 60 * 1000);

  let /** @type {Eyes} */ eyes, /** @type {WebDriver} */ driver;

  function initMobileDriver() {
    const capabilities = new Capabilities();
    capabilities.set('platformName', 'Android');
    capabilities.set('platformVersion', '9.0');
    capabilities.set('deviceName', 'Samsung Galaxy S9 WQHD GoogleAPI Emulator');

    capabilities.set('phoneOnly', false);
    capabilities.set('tabletOnly', false);
    capabilities.set('privateDevicesOnly', false);

    capabilities.set('app', 'https://applitools.bintray.com/Examples/eyes-hello-world.apk');

    capabilities.set('username', TestDataProvider.SAUCE_USERNAME);
    capabilities.set('accesskey', TestDataProvider.SAUCE_ACCESS_KEY);
    capabilities.set('name', 'Android Demo');

    driver = new Builder()
      .usingServer(TestDataProvider.SAUCE_SELENIUM_URL)
      .withCapabilities(capabilities)
      .build();

    return driver;
  }

  it('Appium_Android_CheckWindow', async function () {
    eyes = new Eyes();
    eyes.setMatchTimeout(10 * 1000);

    eyes.setBranchName('BranchName');
    eyes.setBatch(TestDataProvider.BatchInfo);

    const logsPath = process.env.APPLITOOLS_LOGS_PATH || '.';
    eyes.setLogHandler(new FileLogHandler(true, `${logsPath}/Appium/Appium.log`, true));
    eyes.setDebugScreenshotsProvider(new FileDebugScreenshotsProvider());
    eyes.setDebugScreenshotsPath(`${logsPath}/Appium`);
    eyes.setDebugScreenshotsPrefix('Appium_RealDevice');

    eyes.setCutProvider(new FixedCutProvider(96, 192, 0, 0));

    driver = initMobileDriver();
    await eyes.open(driver, 'JS Tests', 'Appium_Android_CheckWindow');

    // const windowSize = await driver.manage().window().getRect();
    await eyes.check('Settings Window', Target.window());
  });

  after(async () => {
    try {
      const results = await eyes.close();
      eyes.getLogger().log(`Mismatches: ${results.getMismatches()}`);
    } finally {
      await eyes.abortIfNotClosed();
      await driver.quit();
    }
  });
});
