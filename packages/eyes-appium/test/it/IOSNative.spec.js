'use strict';

const { Builder } = require('selenium-webdriver');
const { Eyes, Target, ConsoleLogHandler } = require('../../index');

let /** @type WebDriver */ driver, /** @type Eyes */ eyes;
describe('IOSNative', function () {
  this.timeout(5 * 60 * 1000);

  before(async function () {
    // Open the app.
    driver = new Builder()
      .withCapabilities({
        app: 'bs://c7e9b159329c52275bb5de4b7a158849b8a7fd6b',
        os_version: '11',
        device: 'iPhone 8',
        real_mobile: 'true',
        browserName: 'iPhone',
        clearSystemFiles: 'true',
        noReset: 'true',

        'browserstack.user': process.env.BROWSERSTACK_USERNAME,
        'browserstack.key': process.env.BROWSERSTACK_ACCESS_KEY,
      })
      .usingServer('https://hub-cloud.browserstack.com/wd/hub')
      .build();

    // Initialize the eyes SDK and set your private API key.
    eyes = new Eyes();
    eyes.setLogHandler(new ConsoleLogHandler(true));
  });

  beforeEach(async function () {
    // Start visual testing.
    driver = await eyes.open(driver, this.test.parent.title, this.currentTest.title);
  });

  it('Basic window', async function () {
    // Take a screenshot of viewport
    await eyes.check(this.test.title, Target.window());

    // End the test.
    return eyes.close();
  });

  afterEach(async function () {
    // Abort if not closed
    await eyes.abort();
  });

  after(async function () {
    // Close app
    await driver.quit();
  });
});
