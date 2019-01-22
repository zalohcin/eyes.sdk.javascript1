'use strict';

require('chromedriver');
const { Builder } = require('selenium-webdriver');
const { BatchInfo, Region } = require('@applitools/eyes-sdk-core');
const { RectangleSize } = require('@applitools/eyes-common');
const { Eyes, Target, RenderingConfiguration } = require('../../index'); // Should be replaced to `@applitools/eyes-rendering` if used outside of the package

let /** @type {WebDriver} */ webDriver;
describe('EyesRendering', function () {
  this.timeout(5 * 60 * 1000);

  before(async function () {
    webDriver = await new Builder().forBrowser('chrome').build();
  });

  it('VisualGridTestPage', async function () {
    await webDriver.get('https://applitools.github.io/demo/TestPages/VisualGridTestPage');

    const eyes = new Eyes();
    eyes.setBatch(new BatchInfo('EyesRenderingBatch'));

    // eyes.setProxy('http://127.0.0.1:8888');

    try {
      const renderingConfiguration = new RenderingConfiguration();
      renderingConfiguration.setTestName('Open Concurrency with Batch 2');
      renderingConfiguration.setAppName('RenderingGridIntegration');
      renderingConfiguration.addBrowser(800, 600, RenderingConfiguration.BrowserType.CHROME);
      renderingConfiguration.addBrowser(700, 500, RenderingConfiguration.BrowserType.CHROME);
      renderingConfiguration.addBrowser(400, 300, RenderingConfiguration.BrowserType.CHROME);

      await eyes.open(webDriver, 'RenderingGridIntegration_', 'Open Concurrency with Batch 2_', null, renderingConfiguration);

      await eyes.setViewportSize(new RectangleSize({ width: 800, height: 600 }));

      await eyes.check('window', Target.window().ignoreRegions(new Region(200, 200, 50, 100)));

      await eyes.check('region', Target.region(new Region(200, 200, 50, 100)));

      await eyes.check('selector', Target.region('#scroll1'));

      await eyes.closeAndPrintResults(false);
    } catch (err) {
      throw err;
    }
  });

  after(async function () {
    if (webDriver != null) {
      await webDriver.quit();
    }
  });
});
