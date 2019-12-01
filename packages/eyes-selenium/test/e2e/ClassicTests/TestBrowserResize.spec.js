'use strict';

const assert = require('assert');
const { Eyes, Target, RectangleSize } = require('../../../index');
const { SeleniumUtils } = require('../Utils/SeleniumUtils');
const { TestUtils } = require('../Utils/TestUtils');
const { TestDataProvider } = require('../TestDataProvider');

describe('TestBrowserResize', function () {
  this.timeout(5 * 60 * 1000);

  it('BrowserSizeTest', async function () {
    const webDriver = SeleniumUtils.createChromeDriver();
    await webDriver.get('https://applitools.github.io/demo/TestPages/DynamicResolution/mobile.html');
    const eyes = new Eyes();
    eyes.setBatch(TestDataProvider.BatchInfo);
    try {
      await eyes.open(webDriver, 'Browser Size Test', 'Browser Size Test', new RectangleSize(640, 480));
      await eyes.check('Test 1', Target.window());
      const results1 = await eyes.close(false);
      const sessionResults1 = await TestUtils.getSessionResults(eyes.getApiKey(), results1);

      await eyes.open(webDriver, 'Browser Size Test', 'Browser Size Test', new RectangleSize(800, 600));
      await eyes.check('Test 2', Target.window());
      const results2 = await eyes.close(false);
      const sessionResults2 = await TestUtils.getSessionResults(eyes.getApiKey(), results2);

      await eyes.open(webDriver, 'Browser Size Test', 'Browser Size Test', new RectangleSize(1024, 768));
      await eyes.check('Test 3', Target.window());
      const results3 = await eyes.close(false);
      const sessionResults3 = await TestUtils.getSessionResults(eyes.getApiKey(), results3);

      assert.strictEqual(1, sessionResults1.getActualAppOutput().length);
      assert.strictEqual(new RectangleSize(640, 480), sessionResults1.getActualAppOutput()[0].getImage().length);

      assert.strictEqual(1, sessionResults2.getActualAppOutput().length);
      assert.strictEqual(new RectangleSize(800, 600), sessionResults2.getActualAppOutput()[0].getImage().length);

      assert.strictEqual(1, sessionResults3.getActualAppOutput().length);
      assert.strictEqual(new RectangleSize(1024, 768), sessionResults3.getActualAppOutput()[0].getImage().length);
    } finally {
      await webDriver.quit();
      await eyes.abort();
    }
  });
});
