'use strict';

const { By } = require('selenium-webdriver');
const { TestSetup } = require('../TestSetup');
const { TestDataProvider } = require('../TestDataProvider');

describe('TestClassicApi', function () {
  this.timeout(5 * 60 * 1000);

  let /** @type {TestSetup} */ testSetup;
  before(async function () { await testSetup.oneTimeSetup(); });
  beforeEach(async function () { await testSetup.setup(this); });
  afterEach(async function () { await testSetup.tearDown(this); });
  after(async function () { await testSetup.oneTimeTearDown(); });

  const dataProvider = TestDataProvider.fixtureArgs();
  dataProvider.forEach((row) => {
    testSetup = new TestSetup('Eyes Selenium SDK - Classic API', row.options, row.useVisualGrid, row.stitchMode);

    describe(testSetup.toString(), function () {
      it('TestCheckWindow', async function () {
        await testSetup.getEyes().checkWindow('Window');
      });

      it('TestCheckWindowFully', async function () {
        await testSetup.getEyes().checkWindow('Full Window', undefined, true);
      });

      it('TestCheckWindowViewport', async function () {
        await testSetup.getEyes().checkWindow('Viewport Window', undefined, false);
      });

      it('TestCheckRegion', async function () {
        await testSetup.getEyes().checkRegionBy(By.id('overflowing-div'), 'Region', undefined, true);
      });

      it('TestCheckRegion2', async function () {
        await testSetup.getEyes().checkRegionBy(By.id('overflowing-div-image'), 'minions', undefined, true);
      });

      it('TestCheckFrame', async function () {
        await testSetup.getEyes().checkFrame('frame1', undefined, 'frame1');
      });

      it('TestCheckRegionInFrame', async function () {
        await testSetup.getEyes().checkRegionInFrame('frame1', By.id('inner-frame-div'), undefined, 'Inner frame div', true);
      });

      it('TestCheckInnerFrame', async function () {
        testSetup.getEyes().setHideScrollbars(false);
        // await testSetup.getDriver().executeScript("document.documentElement.scrollTo(0,350);");
        await testSetup.getDriver().switchTo().defaultContent();
        await testSetup.getDriver().switchTo().frame(await testSetup.getDriver().findElement(By.name('frame1')));
        await testSetup.getEyes().checkFrame('frame1-1', undefined, 'inner-frame');
        await testSetup.getEyes().getLogger().log('Validating (1) ...');
        await testSetup.getEyes().checkWindow('window after check frame');
        await testSetup.getEyes().getLogger().log('Validating (2) ...');
        const innerFrameBody = testSetup.getDriver().findElement(By.css('body'));
        await testSetup.getDriver().executeScript("arguments[0].style.background='red';", innerFrameBody);
        await testSetup.getEyes().checkWindow('window after change background color of inner frame');
      });

      it('TestCheckWindowAfterScroll', async function () {
        await testSetup.getDriver().executeScript('document.documentElement.scrollTo(0,350);');
        await testSetup.getEyes().checkWindow('viewport after scroll', undefined, false);
      });

      it('TestDoubleCheckWindow', async function () {
        await testSetup.getEyes().checkWindow('first');
        await testSetup.getEyes().checkWindow('second');
        await testSetup.getDriver().sleep(3000);
      });
    });
  });
});
