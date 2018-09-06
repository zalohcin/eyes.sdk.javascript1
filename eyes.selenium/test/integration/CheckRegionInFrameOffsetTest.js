'use strict';

require('chromedriver');
const { Builder, By, Browser } = require('selenium-webdriver');
const { ConsoleLogHandler, RectangleSize } = require('../../../eyes.sdk.core/index');
const { Eyes, Target, StitchMode } = require('../../index');

let driver, eyes;
describe('Eyes Selenium SDK', function () {
  this.timeout(5 * 60 * 1000);

  before(function () {
    driver = new Builder()
      .forBrowser(Browser.CHROME)
      .build();

    eyes = new Eyes();
    eyes.setForceFullPageScreenshot(true);
    eyes.setStitchMode(StitchMode.CSS);
    eyes.setLogHandler(new ConsoleLogHandler(true));
    // eyes.setDebugScreenshotsPath("c:\\temp\\logs");
    // eyes.setSaveDebugScreenshots(true);
  });

  it('WIX like test', function () {
    return eyes.open(driver, this.test.parent.title, this.test.title, new RectangleSize(1024, 600)).then(driver => {
      driver.get('http://applitools.github.io/demo/TestPages/WixLikeTestPage/index.html');

      eyes.check('map', Target.frame('frame1').region(By.tagName('img')));

      return eyes.close();
    });
  });

  afterEach(function () {
    return driver.quit().then(() => eyes.abortIfNotClosed());
  });
});
