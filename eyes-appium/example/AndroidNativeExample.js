'use strict';

const { Builder, Capabilities } = require('selenium-webdriver');
const { ConsoleLogHandler } = require('@applitools/eyes-sdk-core');
const { Eyes, Target } = require('../index'); // should be replaced to '@applitools/eyes-appium'

(async () => {
  const capabilities = new Capabilities();
  capabilities.set('platformName', 'Android');
  capabilities.set('deviceName', 'Android Emulator');
  capabilities.set('platformVersion', '7.0');
  capabilities.set('app', 'https://store.applitools.com/download/Android.apiDemo.apk');
  capabilities.set('clearSystemFiles', true);
  capabilities.set('noReset', true);

  const seleniumServer = 'http://127.0.0.1:4723/wd/hub';
  // const seleniumServer = `https://${process.env.SAUCE_USERNAME}:${process.env.SAUCE_ACCESS_KEY}@ondemand.saucelabs.com:443/wd/hub`;

  // Open the app.
  const driver = await new Builder()
    .withCapabilities(capabilities)
    .usingServer(seleniumServer)
    .build();

  // Initialize the eyes SDK and set your private API key.
  const eyes = new Eyes();
  // eyes.setApiKey('Your API Key');
  eyes.setLogHandler(new ConsoleLogHandler(false));

  try {
    // Start the test and set the browser's viewport size to 800x600.
    await eyes.open(driver, 'Eyes Examples', 'My first Appium native JavaScript test!');

    // Visual validation.
    await eyes.check('Contact list!', Target.window());

    // End the test.
    await eyes.close();
  } finally {
    // Close the browser.
    await driver.quit();

    // If the test was aborted before eyes.close was called ends the test as aborted.
    await eyes.abortIfNotClosed();
  }
})();
