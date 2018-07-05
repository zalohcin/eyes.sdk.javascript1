'use strict';

const { Builder, By} = require('selenium-webdriver');
const { ConsoleLogHandler, RectangleSize} = require('@applitools/eyes.sdk.core');
const { Eyes, Target } = require('../../index');

let driver, eyes;
describe('Eyes.Selenium.JavaScript - hide scrollbars', () => {
  before(function () {
    driver = new Builder()
      .forBrowser('chrome')
      .usingServer('http://localhost:4444/wd/hub')
      .build();

    eyes = new Eyes();
    eyes.setApiKey(process.env.APPLITOOLS_API_KEY);
    eyes.setLogHandler(new ConsoleLogHandler(true));
    eyes.setHideScrollbars(true);
    // eyes.setSaveDebugScreenshots(true);
  });

  it("hide scrollbars selenium", function () {
    return eyes.open(driver, this.test.parent.title, this.test.title, new RectangleSize(800, 560)).then(driver => {
      driver.get('https://astappev.github.io/test-html-pages/');

      // eyes.setHideScrollbars(true);
      eyes.setScrollRootElement(By.id("overflowing-div-image"));
      eyes.check("Entire window", Target.window().fully(true));

      return eyes.close();
    });
  });

  afterEach(function () {
    return driver.quit().then(() => eyes.abortIfNotClosed());
  });
});
