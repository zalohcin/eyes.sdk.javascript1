'use strict';

const assertRejects = require('assert-rejects');
const { Eyes, ClassicRunner, RectangleSize } = require('../../../index');
const { SeleniumUtils } = require('../Utils/SeleniumUtils');

describe('TestClassicRunnerExceptions', function () {
  this.timeout(5 * 60 * 1000);

  it('TestExceptionInGetAllTestResults', async function () {
    const runner = new ClassicRunner();
    runner.getAllTestResults();
    const eyes = new Eyes(runner);
    eyes.setSaveNewTests(false);
    const driver = SeleniumUtils.createChromeDriver();
    await driver.get('https://applitools.com/helloworld?diff1');

    await eyes.open(driver, 'TestClassicRunnerExceptions', 'TestExceptionInGetAllTestResults', new RectangleSize(800, 600));
    await eyes.checkWindow();
    await eyes.closeAsync();

    await driver.quit();
    await assertRejects((async () => {
      const results = await runner.getAllTestResults();
    })());
  });
});
