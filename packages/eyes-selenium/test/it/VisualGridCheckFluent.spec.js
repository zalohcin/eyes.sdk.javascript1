'use strict';

require('chromedriver');
const { Builder, By } = require('selenium-webdriver');
const { Options: ChromeOptions } = require('selenium-webdriver/chrome');
const {
  Eyes,
  VisualGridRunner,
  Target,
  Configuration,
  BrowserType,
  ConsoleLogHandler,
  Region,
} = require('../../index');

let /** @type {WebDriver} */ driver, /** @type {Eyes} */ eyes;
describe('VisualGridCheckFluent', () => {
  before(async () => {
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(new ChromeOptions().headless())
      .build();
    eyes = new Eyes(new VisualGridRunner());
    eyes.setLogHandler(new ConsoleLogHandler(false));
    await driver.get('http://applitools.github.io/demo/TestPages/FramesTestPage/');
  });

  beforeEach(async function () {
    const configuration = new Configuration();
    configuration.setAppName(this.test.parent.title);
    configuration.setTestName(this.currentTest.title);
    configuration.addBrowser(1200, 800, BrowserType.CHROME);
    configuration.addBrowser(1200, 800, BrowserType.FIREFOX);
    eyes.setConfiguration(configuration);

    driver = await eyes.open(driver);
  });

  it('TestCheckWindow', async () => {
    await eyes.check('Window', Target.window());
    return eyes.close();
  });

  it('TestCheckWindowFully', async () => {
    await eyes.check('Full Window', Target.window().fully());
    return eyes.close();
  });

  it('TestCheckRegion', async () => {
    await eyes.check(
      'Region by selector',
      Target.region(By.id('overflowing-div')).ignoreRegions(new Region(50, 50, 100, 100))
    );
    return eyes.close();
  });

  it('TestCheckRegionFully', async () => {
    await eyes.check('Region Fully', Target.region(By.id('overflowing-div-image')).fully());
    return eyes.close();
  });

  // TODO: review why these are commented out
  // it('TestCheckFrame', async function () {
  //   await eyes.check('Frame', Target.frame('frame1'));
  //   return eyes.close();
  // });

  // it('TestCheckFrameFully', async function () {
  //   await eyes.check('Full Frame', Target.frame('frame1').fully());
  //   return eyes.close();
  // });

  // it('TestCheckRegionInFrame', async function () {
  //   await eyes.check('Region in Frame', Target.frame('frame1').region(By.id('inner-frame-div')).fully());
  //   return eyes.close();
  // });

  afterEach(async () => eyes.abort());

  after(() => driver.quit());
});
