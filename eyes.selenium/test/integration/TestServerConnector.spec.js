'use strict';

require('chromedriver');
const { Builder } = require('selenium-webdriver');
const { RectangleSize } = require('../../../eyes.sdk.core/index');
const { Eyes, Target } = require('../../index');

let driver, eyes;
describe('TestServerConnector', function () {
  this.timeout(5 * 60 * 1000);

  before(async function () {
    driver = await new Builder().forBrowser('chrome').build();

    eyes = new Eyes();
  });

  it('TestSessionSummary_Status_Failed', async function () {
    await eyes.open(driver, this.test.parent.title, this.test.title, new RectangleSize(800, 599));

    await driver.get('https://applitools.com/helloworld');

    await eyes.check('Hello', Target.window());

    const results = await eyes.close();

    await results.delete();
  });

  afterEach(async function () {
    await driver.quit();
    await eyes.abortIfNotClosed();
  });
});
