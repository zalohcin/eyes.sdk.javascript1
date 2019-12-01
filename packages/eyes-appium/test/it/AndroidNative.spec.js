'use strict';

const { Builder } = require('selenium-webdriver');
const { Eyes, Target, ConsoleLogHandler } = require('../../index');

let /** @type WebDriver */ driver, /** @type Eyes */ eyes;
describe('AndroidNative', function () {
  this.timeout(5 * 60 * 1000);

  before(async function () {
    // Open the app.
    driver = new Builder()
      .withCapabilities({
        app: 'bs://828136042405247c5bd09fad8f8002763dee98ab',
        os_version: '6.0',
        device: 'Google Nexus 6',
        real_mobile: 'true',
        browserName: 'Android',
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
