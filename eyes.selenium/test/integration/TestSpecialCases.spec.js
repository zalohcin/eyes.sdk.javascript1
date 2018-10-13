'use strict';

const { By } = require('selenium-webdriver');

const { TestsDataProvider } = require('./TestsDataProvider');
const { TestSetup } = require('./TestSetup');
const { Target } = require('../../index');

let eyes, driver;
const testSuitName = 'Eyes Selenium SDK - Special Cases';
const testedPageUrl = 'http://applitools.github.io/demo/TestPages/WixLikeTestPage/index.html';

const dataProvider = TestsDataProvider.dp();
dataProvider.forEach(row => {
  const testSetup = new TestSetup('TestSpecialCases', testSuitName, testedPageUrl);
  testSetup.setData(...row, false);

  describe(testSetup.toString(), function () {
    this.timeout(5 * 60 * 1000);

    beforeEach(async function () {
      await testSetup.beforeMethod(this.currentTest.title);
      eyes = testSetup.getEyes();
      driver = testSetup.getDriver();
    });

    afterEach(async function () {
      await testSetup.afterMethod();
    });

    it('TestCheckRegionInAVeryBigFrame', async function () {
      await eyes.check('map', Target.frame('frame1').region(By.tagName('img')));
    });

    it('TestCheckRegionInAVeryBigFrameAfterManualSwitchToFrame', async function () {
      await driver.switchTo().frame('frame1');

      const element = await driver.findElement(By.cssSelector('img'));
      await driver.executeScript('arguments[0].scrollIntoView(true);', element);

      await eyes.check('', Target.region(By.cssSelector('img')));
    });
  });
});
