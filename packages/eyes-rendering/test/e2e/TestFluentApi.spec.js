'use strict';

const { By, Builder } = require('selenium-webdriver');
const { Region, FloatingMatchSettings, BatchInfo } = require('@applitools/eyes-sdk-core');

const { Eyes, Target, RenderingConfiguration } = require('../../index');

let eyes, driver;
describe('Eyes Rendering SDK - Fluent API', function () {
  this.timeout(5 * 60 * 1000);

  before(async function () {
    driver = await new Builder().forBrowser('chrome').build();
    await driver.get('http://applitools.github.io/demo/TestPages/FramesTestPage/');

    eyes = new Eyes();
    eyes.setBatch(new BatchInfo('EyesRenderingFluent'));
    eyes.setProxy('http://127.0.0.1:8888');

    const renderingConfiguration = new RenderingConfiguration();
    renderingConfiguration.setTestName('Open Concurrency with Batch 2');
    renderingConfiguration.setAppName('RenderingGridIntegration');
    renderingConfiguration.addBrowser(800, 600, RenderingConfiguration.BrowserType.CHROME);
    renderingConfiguration.addBrowser(700, 500, RenderingConfiguration.BrowserType.CHROME);
    renderingConfiguration.addBrowser(400, 300, RenderingConfiguration.BrowserType.CHROME);
    await eyes.open(driver, 'EyesRenderingFluent', 'TestName', {width: 1000, height: 800}, renderingConfiguration);
  });

  after(async function () {
    await eyes.closeAndPrintResults(false);

    if (driver != null) {
      await driver.quit();
    }
  });

  it('TestCheckWindowWithIgnoreRegion_Fluent', async function () {
    await driver.findElement(By.css('input')).sendKeys('My Input');
    await eyes.check('Fluent - Window with Ignore region', Target.window()
      .fully()
      .timeout(5000)
      .ignoreRegions(new Region(50, 50, 100, 100)));
  });

  it('TestCheckRegionWithIgnoreRegion_Fluent', async function () {
    await eyes.check('Fluent - Region with Ignore region', Target.region(By.id('overflowing-div'))
      .ignoreRegions(new Region(50, 50, 100, 100)));
  });

  // it('TestCheckFrame_Fully_Fluent', async function () {
  //   await eyes.check('Fluent - Full Frame', Target.frame('frame1').fully());
  // });

  // it('TestCheckFrame_Fluent', async function () {
  //   await eyes.check('Fluent - Frame', Target.frame('frame1'));
  // });

  // it('TestCheckFrameInFrame_Fully_Fluent', async function () {
  //   await eyes.check('Fluent - Full Frame in Frame', Target.frame('frame1')
  //     .frame('frame1-1')
  //     .fully());
  // });

  // it('TestCheckRegionInFrame_Fluent', async function () {
  //   await eyes.check('Fluent - Region in Frame', Target.frame('frame1')
  //     .region(By.id('inner-frame-div'))
  //     .fully());
  // });

  // it('TestCheckRegionInFrameInFrame_Fluent', async function () {
  //   await eyes.check('Fluent - Region in Frame in Frame', Target.frame('frame1')
  //     .frame('frame1-1')
  //     .region(By.css('img'))
  //     .fully());
  // });

  // it('TestScrollbarsHiddenAndReturned_Fluent', async function () {
  //   await eyes.check('Fluent - Window (Before)', Target.window().fully());
  //
  //   await eyes.check(
  //     'Fluent - Inner frame div',
  //     Target.frame('frame1')
  //       .region(By.id('inner-frame-div'))
  //       .fully()
  //   );
  //
  //   await eyes.check('Fluent - Window (After)', Target.window().fully());
  // });

  // it('TestCheckRegionInFrame2_Fluent', async function () {
  //   await eyes.check('Fluent - Inner frame div 1', Target.frame('frame1')
  //     .region(By.id('inner-frame-div'))
  //     .fully()
  //     .timeout(5000)
  //     .ignoreRegions(new Region(50, 50, 100, 100)));
  //
  //   await eyes.check('Fluent - Inner frame div 2', Target.frame('frame1')
  //     .region(By.id('inner-frame-div'))
  //     .fully()
  //     .ignoreRegions(new Region(50, 50, 100, 100))
  //     .ignoreRegions(new Region(70, 170, 90, 90)));
  //
  //   await eyes.check('Fluent - Inner frame div 3', Target.frame('frame1')
  //     .region(By.id('inner-frame-div'))
  //     .fully()
  //     .timeout(5000));
  //
  //   await eyes.check('Fluent - Inner frame div 4', Target.frame('frame1')
  //     .region(By.id('inner-frame-div'))
  //     .fully());
  //
  //   await eyes.check('Fluent - Full frame with floating region', Target.frame('frame1')
  //     .fully()
  //     .layout()
  //     .floatingRegion(new Region(200, 200, 150, 150), 25, 25, 25, 25));
  // });

  // it('TestCheckFrameInFrame_Fully_Fluent2', async function () {
  //   await eyes.check('Fluent - Window', Target.window()
  //     .fully());
  //
  //   await eyes.check('Fluent - Full Frame in Frame 2', Target.frame('frame1')
  //     .frame('frame1-1')
  //     .fully());
  // });

  it('TestCheckElementFully_Fluent', async function () {
    const element = await driver.findElement(By.id('overflowing-div-image'));
    await eyes.check('Fluent - Region by element - fully', Target.region(element).fully());
  });
});
