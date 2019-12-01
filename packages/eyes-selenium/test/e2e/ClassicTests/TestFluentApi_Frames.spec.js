'use strict';

const { By } = require('selenium-webdriver');
const { TestSetup } = require('../TestSetup');
const { TestDataProvider } = require('../TestDataProvider');
const { Target, Region, FloatingMatchSettings } = require('../../../index');

describe('TestFluentApi_Frames', function () {
  this.timeout(5 * 60 * 1000);

  let /** @type {TestSetup} */ testSetup;
  before(async function () { await testSetup.oneTimeSetup(); });
  beforeEach(async function () { await testSetup.setup(this); });
  afterEach(async function () { await testSetup.tearDown(this); });
  after(async function () { await testSetup.oneTimeTearDown(); });

  const dataProvider = TestDataProvider.fixtureArgs();
  dataProvider.forEach((row) => {
    testSetup = new TestSetup('Eyes Selenium SDK - Fluent API', row.options, row.useVisualGrid, row.stitchMode);

    describe(testSetup.toString(), function () {
      it('TestCheckFrame_Fully_Fluent', async function () {
        await testSetup.getEyes().check('Fluent - Full Frame', Target.frame('frame1').fully());
      });

      it('TestCheckFrame_Fluent', async function () {
        await testSetup.getEyes().check('Fluent - Frame', Target.frame('frame1'));
      });

      it('TestCheckFrameInFrame_Fully_Fluent', async function () {
        await testSetup.getEyes().check('Fluent - Full Frame in Frame', Target.frame('frame1')
          .frame('frame1-1')
          .fully());
      });

      // it('TestCheckFrameInFrame_Fluent', async function () {
      //   await testSetup.getEyes().check('Fluent - Frame in Frame', Target.frame('frame1').frame('frame1-1'));
      // });

      it('TestCheckRegionInFrame_Fluent', async function () {
        await testSetup.getEyes().check('Fluent - Region in Frame', Target.frame('frame1')
          .region(By.id('inner-frame-div'))
          .fully());
      });

      it('TestCheckRegionInFrameInFrame_Fluent', async function () {
        await testSetup.getEyes().check('Fluent - Region in Frame in Frame', Target.frame('frame1')
          .frame('frame1-1')
          .region(By.css('img'))
          .fully());
      });

      it('TestCheckRegionInFrame2_Fluent', async function () {
        await testSetup.getEyes().check('Fluent - Inner frame div 1', Target.frame('frame1')
          .region(By.id('inner-frame-div'))
          .fully()
          .timeout(5000)
          .ignoreRegions(new Region(50, 50, 100, 100)));

        await testSetup.getEyes().check('Fluent - Inner frame div 2', Target.frame('frame1')
          .region(By.id('inner-frame-div'))
          .fully()
          .ignoreRegions(new Region(50, 50, 100, 100))
          .ignoreRegions(new Region(70, 170, 90, 90)));

        await testSetup.getEyes().check('Fluent - Inner frame div 3', Target.frame('frame1')
          .region(By.id('inner-frame-div'))
          .fully()
          .timeout(5000));

        await testSetup.getEyes().check('Fluent - Inner frame div 4', Target.frame('frame1')
          .region(By.id('inner-frame-div'))
          .fully());

        await testSetup.getEyes().check('Fluent - Full frame with floating region', Target.frame('frame1')
          .fully()
          .layout()
          .floatingRegions(25, new Region(200, 200, 150, 150)));
      });

      it('TestCheckRegionInFrame3_Fluent', async function () {
        await testSetup.getEyes().check('Fluent - Full frame with floating region', Target.frame('frame1')
          .fully()
          .layout()
          .floatingRegions(25, new Region(200, 200, 150, 150)));

        testSetup.setExpectedFloatingsRegions(new FloatingMatchSettings(200, 200, 150, 150, 25, 25, 25, 25));
      });

      it('TestCheckRegionByCoordinateInFrameFully_Fluent', async function () {
        await testSetup.getEyes().check('Fluent - Inner frame coordinates', Target.frame('frame1')
          .region(new Region(30, 40, 400, 1200))
          .fully());
      });

      it('TestCheckRegionByCoordinateInFrame_Fluent', async function () {
        await testSetup.getEyes().check('Fluent - Inner frame coordinates', Target.frame('frame1')
          .region(new Region(30, 40, 400, 1200)));
      });

      it('TestCheckFrameInFrame_Fully_Fluent2', async function () {
        await testSetup.getEyes().check('Fluent - Window with Ignore region 2', Target.window()
          .fully());

        await testSetup.getEyes().check('Fluent - Full Frame in Frame 2', Target.frame('frame1')
          .frame('frame1-1')
          .fully());
      });

      // it('TestCheckLongIFrameModal', async function () {
      //   await testSetup.getDriver().findElement(By.id('stretched')).click();
      //   const frame = await testSetup.getDriver().findElement(By.css('#modal2 iframe'));
      //   await testSetup.getDriver().switchTo().frame(frame);
      //
      //   const element = await testSetup.getDriver().findElement(By.css('html'));
      //   const elRect = await element.getRect();
      //   const elementRect = new Region(elRect);
      //   let rect;
      //   const targets = [];
      //   for (let i = elRect.y, c = 1; i < elRect.y + elRect.height; i += 5000, c += 1) {
      //     if (elementRect.getBottom() > i + 5000) {
      //       rect = new Region(elRect.x, i, elRect.width, 5000);
      //     } else {
      //       rect = new Region(elRect.x, i, elRect.width, elementRect.getBottom() - i);
      //     }
      //     targets.push(Target.region(rect));
      //   }
      //   await testSetup.getEyes().check(targets);
      // });

      // it('TestCheckLongOutOfBoundsIFrameModal', async function () {
      //   await testSetup.getDriver().findElement(By.id('hidden_click')).click();
      //   const frame = await testSetup.getDriver().findElement(By.css('#modal3 iframe'));
      //   await testSetup.getDriver().switchTo().frame(frame);
      //
      //   const element = await testSetup.getDriver().findElement(By.css('html'));
      //   const elRect = element.getRect();
      //   const elementRect = new Region(elRect);
      //   let rect;
      //   const targets = [];
      //   for (let i = elRect.y, c = 1; i < elRect.y + elRect.height; i += 5000, c += 1) {
      //     if (elementRect.getBottom() > i + 5000) {
      //       rect = new Region(elRect.x, i, elRect.width, 5000);
      //     } else {
      //       rect = new Region(elRect.x, i, elRect.width, elementRect.getBottom() - i);
      //     }
      //     targets.push(Target.region(rect));
      //   }
      //   await testSetup.getEyes().check(targets);
      // });
    });
  });
});
