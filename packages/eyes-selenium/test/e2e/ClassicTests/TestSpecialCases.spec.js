'use strict';

const { By } = require('selenium-webdriver');
const { TestSetup } = require('../TestSetup');
const { TestDataProvider } = require('../TestDataProvider');
const { Target } = require('../../../index');

describe('TestSpecialCases', function () {
  this.timeout(5 * 60 * 1000);

  let /** @type {TestSetup} */ testSetup;
  before(async function () { await testSetup.oneTimeSetup(); });
  beforeEach(async function () { await testSetup.setup(this); });
  afterEach(async function () { await testSetup.tearDown(this); });
  after(async function () { await testSetup.oneTimeTearDown(); });

  const dataProvider = TestDataProvider.fixtureArgs();
  dataProvider.forEach((row) => {
    testSetup = new TestSetup('Eyes Selenium SDK - Special Cases', row.options, row.useVisualGrid, row.stitchMode);
    testSetup.setTestedPageUrl('https://applitools.github.io/demo/TestPages/WixLikeTestPage/index.html');

    describe(testSetup.toString(), function () {
      it('TestCheckRegionInAVeryBigFrame', async function () {
        await testSetup.getEyes().check('map', Target.frame('frame1').region(By.css('img')));
      });

      it('TestCheckRegionInAVeryBigFrameAfterManualSwitchToFrame', async function () {
        await testSetup.getDriver().switchTo().frame('frame1');

        // const element = await testSetup.getDriver().findElement(By.css('img'));
        // await testSetup.getDriver().executeScript('arguments[0].scrollIntoView(true);', element);

        await testSetup.getEyes().check('', Target.region(By.css('img')));
      });
    });
  });
});
