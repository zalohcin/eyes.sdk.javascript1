'use strict';

const { Builder, By } = require('selenium-webdriver');
const { Eyes, ConsoleLogHandler } = require('../../index');

let /** @type WebDriver */ driver, /** @type Eyes */ eyes;
describe('AndroidBrowser', function () {
  this.timeout(5 * 60 * 1000);

  before(async function () {
    // Open the app.
    driver = new Builder()
      .withCapabilities({
        os_version: '6.0',
        device: 'Google Nexus 6',
        real_mobile: 'true',
        browserName: 'Chrome',
        deviceOrientation: 'portrait',

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

  it('HelloWorld', async function () {
    // Navigate the browser to the "hello world!" web-site.
    await driver.get('https://applitools.com/helloworld');

    // Visual checkpoint #1.
    await eyes.checkWindow('Hello!');

    // Click the "Click me!" button.
    await driver.findElement(By.tagName('button')).click();

    // Visual checkpoint #2.
    await eyes.checkWindow('Click!');

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
