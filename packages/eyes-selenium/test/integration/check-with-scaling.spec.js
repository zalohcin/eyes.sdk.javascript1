'use strict';

require('chromedriver');
const { Builder, By } = require('selenium-webdriver');
const { Options } = require('selenium-webdriver/chrome');
const { ConsoleLogHandler, RectangleSize } = require('@applitools/eyes.sdk.core');
const { Eyes, Target } = require('../../index');

let driver, eyes;
describe('Eyes.Selenium.JavaScript - check-with-scaling', function () {
  this.timeout(5 * 60 * 1000);

  before(function () {
    const options = new Options().addArguments('--force-device-scale-factor=1.25');
    // noinspection JSCheckFunctionSignatures
    driver = new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();

    eyes = new Eyes();
    eyes.setApiKey(process.env.APPLITOOLS_API_KEY);
    eyes.setLogHandler(new ConsoleLogHandler(true));
  });

  it('test check with scaling', function () {
    return eyes.open(driver, this.test.parent.title, this.test.title, new RectangleSize(800, 560)).then(driver => {
      driver.get('https://astappiev.github.io/test-html-pages/');

      eyes.check('Entire window', Target.window().fully());

      eyes.check('Text block', Target.region(By.id('overflowing-div')).fully());

      eyes.check('Minions', Target.region(By.id('overflowing-div-image')).fully());

      return eyes.close();
    });
  });

  afterEach(function () {
    return driver.quit().then(() => eyes.abortIfNotClosed());
  });
});
