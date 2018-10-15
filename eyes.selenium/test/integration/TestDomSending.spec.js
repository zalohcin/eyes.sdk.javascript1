'use strict';

require('chromedriver');
const { Builder } = require('selenium-webdriver');
const { ConsoleLogHandler, RectangleSize } = require('@applitools/eyes.sdk.core');
const { Eyes, Target } = require('../../index');

let driver, eyes;
describe('Eyes.Selenium.JavaScript - send dom', function () {
  this.timeout(5 * 60 * 1000);

  before(function () {
    driver = new Builder()
      .forBrowser('chrome')
      .build();

    eyes = new Eyes();
    eyes.setApiKey(process.env.APPLITOOLS_API_KEY);
    eyes.setLogHandler(new ConsoleLogHandler(true));
    // eyes.setProxy('http://localhost:8888');
  });

  it('should happen something', function () {
    return eyes.open(driver, this.test.parent.title, this.test.title, new RectangleSize(800, 560)).then(driver => {
      driver.get('http://applitools.github.io/demo/TestPages/DomTest/dom_capture.html');

      eyes.check('A Window', Target.window().sendDom(true));

      return eyes.close();
    });
  });

  afterEach(function () {
    return driver.quit().then(() => eyes.abortIfNotClosed());
  });
});
