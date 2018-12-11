'use strict';

const { Builder } = require('selenium-webdriver');
const { ConsoleLogHandler, Region } = require('@applitools/eyes.sdk.core');
const { Target } = require('@applitools/eyes.selenium');
const { Eyes } = require('../../index');

let driver, eyes;
describe('Eyes.Appium.JavaScript - appium-native', function () {
  before(function () {
    driver = new Builder()
      .withCapabilities({
        platformName: 'Android',
        deviceName: 'android-24-google_apis-x86_64-v24.4.1-wd-manager',
        platformVersion: '7.0',
        app: 'http://saucelabs.com/example_files/ContactManager.apk',
        browserName: '',
        clearSystemFiles: 'true',
        noReset: 'true',
      })
      .usingServer('http://localhost:4723/wd/hub')
      .build();

    eyes = new Eyes();
    eyes.setLogHandler(new ConsoleLogHandler(true));
  });

  it('test check window in Contacts app', function () {
    return eyes.open(driver, this.test.parent.title, this.test.title).then(() => {
      eyes.check('Contact list!', Target.window().ignore(new Region(418, 2, 60, 30)));

      return eyes.close();
    });
  });

  afterEach(function () {
    return driver.quit().then(() => eyes.abortIfNotClosed());
  });
});
