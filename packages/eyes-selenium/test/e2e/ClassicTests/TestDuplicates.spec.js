'use strict';

const { TestSetup } = require('../TestSetup');
const { TestDataProvider } = require('../TestDataProvider');

describe('TestDuplicates', function () {
  this.timeout(5 * 60 * 1000);

  let /** @type {TestSetup} */ testSetup;
  before(async function () { await testSetup.oneTimeSetup(); });
  beforeEach(async function () { await testSetup.setup(this); });
  afterEach(async function () { await testSetup.tearDown(this); });
  after(async function () { await testSetup.oneTimeTearDown(); });

  const dataProvider = TestDataProvider.fixtureArgs();
  dataProvider.forEach((row) => {
    testSetup = new TestSetup('Eyes Selenium SDK - Duplicates', row.options, row.useVisualGrid, row.stitchMode);
    testSetup.setTestedPageUrl('https://applitools.github.io/demo/TestPages/VisualGridTestPage/duplicates.html');

    describe(testSetup.toString(), function () {
      it('TestDuplicatedIFrames', async function () {
        await testSetup.getDriver().switchTo().frame(2);
        await testSetup.getDriver().sleep(30000);

        await testSetup.getDriver().switchTo().defaultContent();
        await testSetup.getEyes().checkWindow('Duplicated Iframes');
      });
    });
  });
});
