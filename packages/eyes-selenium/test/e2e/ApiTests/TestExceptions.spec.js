'use strict';

const assertRejects = require('assert-rejects');
const { Eyes, VisualGridRunner, ClassicRunner, Configuration } = require('../../../index');
const { SeleniumUtils } = require('../Utils/SeleniumUtils');

describe('TestExceptions', function () {
  [
    { useVisualGrid: true },
    { useVisualGrid: false },
  ].forEach(({ useVisualGrid }) => {
    describe(`useVisualGrid: ${useVisualGrid}`, function () {
      it('TestEyesExceptions', async function () {
        const driver = SeleniumUtils.createChromeDriver();
        const runner = useVisualGrid ? new VisualGridRunner(10) : new ClassicRunner();
        const eyes = new Eyes(runner);

        try {
          eyes.setApiKey('');
          await assertRejects(eyes.open(driver), Error);

          eyes.setApiKey('someAPIkey');
          await assertRejects(eyes.open(driver), Error);

          const conf = new Configuration();
          conf.setAppName('');
          eyes.setConfiguration(conf);
          await assertRejects(eyes.open(driver), Error);

          conf.setAppName('app');
          eyes.setConfiguration(conf);
          await assertRejects(eyes.open(driver), Error);

          conf.setTestName('');
          eyes.setConfiguration(conf);
          await assertRejects(eyes.open(driver), Error);

          conf.setTestName('test');
          eyes.setConfiguration(conf);
          await eyes.open(driver);

          if (useVisualGrid) {
            await assertRejects((async () => {
              const results = await eyes.close();
              await results.delete();
              await runner.getAllTestResults();
            })(), Error);
          } else {
            const results = await eyes.close();
            await results.delete();
            await runner.getAllTestResults();
          }
        } finally {
          await eyes.abort();
          await driver.quit();
        }
      });
    });
  });
});
