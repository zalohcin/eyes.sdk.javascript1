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
    eyes.setSendDom(true);
    // eyes.setProxy('http://localhost:8888');
  });

  it('should happen something', async function () {
    driver = await eyes.open(driver, this.test.parent.title, this.test.title, new RectangleSize(800, 560));

    await driver.get('http://applitools.github.io/demo/TestPages/DomTest/dom_capture.html');
    await eyes.check('A Test Window', Target.window().sendDom(true));

    await driver.get('https://applitools.com');
    await eyes.check('An Applitools Window', Target.window());

    await driver.get('https://booking.com');
    await driver.findElement(By.css('input.sb-searchbox__input.sb-destination__input')).sendKeys('Kiev, Ukraine');
    await driver.findElement(By.css('button.sb-searchbox__button')).click();
    await driver.sleep(200);
    await eyes.check('A Booking Window', Target.window());

    await eyes.close();
  });

  afterEach(function () {
    return driver.quit().then(() => eyes.abortIfNotClosed());
  });
});
