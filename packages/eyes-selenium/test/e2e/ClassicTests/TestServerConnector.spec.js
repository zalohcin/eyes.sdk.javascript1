'use strict';

const { Eyes, Target, RectangleSize } = require('../../../index');
const { SeleniumUtils } = require('../Utils/SeleniumUtils');
const { TestDataProvider } = require('../TestDataProvider');

describe('TestServerConnector', function () {
  this.timeout(5 * 60 * 1000);

  it('TestDelete', async function () {
    let driver = SeleniumUtils.createChromeDriver();
    const eyes = new Eyes();
    eyes.setBatch(TestDataProvider.BatchInfo);
    try {
      driver = await eyes.open(driver, 'TestSessionConnector', 'TestSessionConnector', new RectangleSize(800, 600));
      await driver.get('https://applitools.com/helloworld');
      await eyes.check('Hello!', Target.window());
      const results = await eyes.close();
      await results.deleteSession();
    } finally {
      await driver.quit();
      await eyes.abort();
    }
  });
});
