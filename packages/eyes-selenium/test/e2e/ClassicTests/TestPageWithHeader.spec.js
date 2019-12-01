'use strict';

const { By } = require('selenium-webdriver');
const { TestSetup } = require('../TestSetup');
const { TestDataProvider } = require('../TestDataProvider');
const { Target } = require('../../../index');

describe('TestPageWithHeader', function () {
  this.timeout(5 * 60 * 1000);

  let /** @type {TestSetup} */ testSetup;
  before(async function () { await testSetup.oneTimeSetup(); });
  beforeEach(async function () { await testSetup.setup(this); });
  afterEach(async function () { await testSetup.tearDown(this); });
  after(async function () { await testSetup.oneTimeTearDown(); });

  const dataProvider = TestDataProvider.fixtureArgs();
  dataProvider.forEach((row) => {
    testSetup = new TestSetup('Eyes Selenium SDK - Page With Header', row.options, row.useVisualGrid, row.stitchMode);
    testSetup.setTestedPageUrl('https://applitools.github.io/demo/TestPages/PageWithHeader/index.html');

    describe(testSetup.toString(), function () {
      it('TestCheckPageWithHeader_Window', async function () {
        await testSetup.getEyes().check('Page with header', Target.window().fully(false));
      });

      it('TestCheckPageWithHeader_Window_Fully', async function () {
        await testSetup.getEyes().check('Page with header - fully', Target.window().fully(true));
      });

      it('TestCheckPageWithHeader_Region', async function () {
        await testSetup.getEyes().check('Page with header', Target.region(By.css('div.page')).fully(false));
      });

      it('TestCheckPageWithHeader_Region_Fully', async function () {
        await testSetup.getEyes().check('Page with header - fully', Target.region(By.css('div.page')).fully(true));
      });
    });
  });
});
