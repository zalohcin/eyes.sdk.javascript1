'use strict';

const { Builder } = require('selenium-webdriver');
const { BatchInfo, CorsIframeHandle } = require('@applitools/eyes-sdk-core');

const { Eyes, Target, RenderingConfiguration } = require('../../index');

let eyes, driver;
describe('Eyes Rendering SDK - Cors Test', function () {
  this.timeout(5 * 60 * 1000);

  before(async function () {
    driver = await new Builder().forBrowser('chrome').build();
    await driver.get('http://applitools-dom-capture-origin-1.surge.sh/testWithCrossOriginIframe.surge.html');

    eyes = new Eyes();
    eyes.setBatch(new BatchInfo('EyesRenderingCors'));
    eyes.setCorsIframeHandle(CorsIframeHandle.BLANK);

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

  it('TestWindowWithIframe', async function () {
    await eyes.check('Test window', Target.window().fully());
  });
});
