'use strict';

require('chromedriver');
const { Builder, By } = require('selenium-webdriver');
const { ConsoleLogHandler, Region } = require('@applitools/eyes-sdk-core');
const { Eyes, Target, RenderingConfiguration } = require('../../index');

let /** @type {WebDriver} */ driver, /** @type {Eyes} */ eyes;
describe('VisualGridCheckFluent', function () {
  this.timeout(5 * 60 * 1000);

  before(async function () {
    driver = new Builder().forBrowser('chrome').build();

    eyes = new Eyes();
    eyes.setApiKey(process.env.APPLITOOLS_API_KEY);
    eyes.setLogHandler(new ConsoleLogHandler(true));
    // eyes.setProxy('http://localhost:8888');

    await driver.get('http://applitools.github.io/demo/TestPages/FramesTestPage/');

    const renderingConfiguration = new RenderingConfiguration();
    renderingConfiguration.setTestName('Open Concurrency with Batch 2');
    renderingConfiguration.setAppName('RenderingGridIntegration');
    renderingConfiguration.addBrowser(800, 600, RenderingConfiguration.BrowserType.CHROME);
    renderingConfiguration.addBrowser(700, 500, RenderingConfiguration.BrowserType.CHROME);
    renderingConfiguration.addBrowser(400, 300, RenderingConfiguration.BrowserType.CHROME);
    await eyes.open(driver, 'EyesRenderingFluent', 'TestName', {width: 1000, height: 800}, renderingConfiguration);
  });

  beforeEach(async function () {
    driver = await eyes.open(driver, this.test.parent.title, this.currentTest.title, { width: 1200, height: 800 });
  });

  it('TestCheckWindow', async function () {
    await eyes.check('Window', Target.window());
    return eyes.close();
  });

  it('TestCheckWindowFully', async function () {
    await eyes.check('Full Window', Target.window().fully());
    return eyes.close();
  });

  it('TestCheckRegion', async function () {
    await eyes.check('Region by selector', Target.region(By.id('overflowing-div')).ignoreRegions(new Region(50, 50, 100, 100)));
    return eyes.close();
  });

  it('TestCheckRegionFully', async function () {
    await eyes.check('Region Fully', Target.region(By.id('overflowing-div-image')).fully());
    return eyes.close();
  });

  it('TestCheckFrame', async function () {
    await eyes.check('Frame', Target.frame('frame1'));
    return eyes.close();
  });

  it('TestCheckFrameFully', async function () {
    await eyes.check('Full Frame', Target.frame('frame1').fully());
    return eyes.close();
  });

  it('TestCheckRegionInFrame', async function () {
    await eyes.check('Region in Frame', Target.frame('frame1').region(By.id('inner-frame-div')).fully());
    return eyes.close();
  });

  afterEach(async function () {
    return eyes.abortIfNotClosed();
  });

  after(function () {
    return driver.quit();
  });
});
