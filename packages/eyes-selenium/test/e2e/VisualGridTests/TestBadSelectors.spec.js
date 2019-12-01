'use strict';

const assertRejects = require('assert-rejects');
const { By } = require('selenium-webdriver');
const { Target, RectangleSize } = require('../../../index');
const { SeleniumUtils } = require('../Utils/SeleniumUtils');

describe('TestBadSelectors', function () {
  this.timeout(5 * 60 * 1000);

  [
    { useVisualGrid: true },
    { useVisualGrid: false },
  ].forEach(({ useVisualGrid }) => {
    describe(`useVisualGrid: ${useVisualGrid}`, function () {
      it('TestCheckRegionWithBadSelector', async function () {
        const { driver, runner, eyes } = SeleniumUtils.initEyes(useVisualGrid, 'TestCheckRegionWithBadSelector');
        await driver.get('https://applitools.github.io/demo/TestPages/VisualGridTestPage/');

        const suffix = useVisualGrid ? '_VG' : '';
        await eyes.open(driver, 'Applitools Eyes JS SDK', `TestCheckRegionWithBadSelector${suffix}`, new RectangleSize(1200, 800));

        await assertRejects((async () => {
          await eyes.checkRegion(By.css('#element_that_does_not_exist'));

          await eyes.closeAsync();
          await runner.getAllTestResults();
        })());

        await driver.quit();
      });

      it('TestCheckRegionWithBadIgnoreSelector', async function () {
        const { driver, runner, eyes } = SeleniumUtils.initEyes(useVisualGrid, 'TestCheckRegionWithBadIgnoreSelector');
        await driver.get('https://applitools.github.io/demo/TestPages/VisualGridTestPage/');

        const suffix = useVisualGrid ? '_VG' : '';
        await eyes.open(driver, 'Applitools Eyes JS SDK', `TestCheckRegionWithBadIgnoreSelector${suffix}`, new RectangleSize(1200, 800));

        await eyes.check(null, Target.window().ignoreRegions(By.css('body>p:nth-of-type(14)'))
          .beforeRenderScreenshotHook("var p = document.querySelector('body>p:nth-of-type(14)'); p.parentNode.removeChild(p);"));

        try {
          await eyes.close();
          await runner.getAllTestResults();
        } finally {
          await driver.quit();
        }
      });

      it('TestCheckRegionWithBadSelectorBeforeValidCheck', async function () {
        const { driver, runner, eyes } = SeleniumUtils.initEyes(useVisualGrid, 'TestCheckRegionWithBadSelectorBeforeValidCheck');
        await driver.get('https://applitools.github.io/demo/TestPages/VisualGridTestPage/');

        const suffix = useVisualGrid ? '_VG' : '';
        await eyes.open(driver, 'Applitools Eyes JS SDK', `TestCheckRegionWithBadSelectorBeforeValidCheck${suffix}`, new RectangleSize(1200, 800));

        await assertRejects((async () => {
          await eyes.checkRegion(By.css('#element_that_does_not_exist'));
          await driver.findElement(By.id('centered')).click();
          await eyes.checkRegion(By.id('modal-content'));

          await eyes.closeAsync();
          await runner.getAllTestResults();
        })());
        await driver.quit();
      });
    });
  });
});
