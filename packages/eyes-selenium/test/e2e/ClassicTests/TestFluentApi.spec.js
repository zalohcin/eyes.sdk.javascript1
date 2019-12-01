'use strict';

const { By } = require('selenium-webdriver');
const { TestSetup } = require('../TestSetup');
const { TestDataProvider } = require('../TestDataProvider');
const { Target, Region, FloatingMatchSettings, AccessibilityLevel, AccessibilityMatchSettings, AccessibilityRegionType, StitchMode } = require('../../../index');

describe('TestFluentApi', function () {
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
      it('TestCheckWindowWithIgnoreRegion_Fluent', async function () {
        await testSetup.getDriver().findElement(By.css('input')).sendKeys('My Input');
        await testSetup.getEyes().check('Fluent - Window with Ignore region', Target.window()
          .fully()
          .timeout(5000)
          .ignoreCaret()
          .ignoreRegions(new Region(50, 50, 100, 100)));

        testSetup.setExpectedIgnoreRegions(new Region(50, 50, 100, 100));
      });

      it('TestCheckRegionWithIgnoreRegion_Fluent', async function () {
        await testSetup.getEyes().check('Fluent - Region with Ignore region', Target.region(By.id('overflowing-div'))
          .ignoreRegions(new Region(50, 50, 100, 100)));

        testSetup.setExpectedIgnoreRegions(new Region(50, 50, 100, 100));
      });

      it('TestCheckRegionBySelectorAfterManualScroll_Fluent', async function () {
        await testSetup.getDriver().executeScript('window.scrollBy(0,900);');
        await testSetup.getEyes().check('Fluent - Region by selector after manual scroll', Target.region(By.id('centered')));
      });

      it('TestCheckWindow_Fluent', async function () {
        await testSetup.getEyes().check('Fluent - Window', Target.window());
      });

      it('TestCheckWindowWithIgnoreBySelector_Fluent', async function () {
        await testSetup.getEyes().check('Fluent - Window with ignore region by selector', Target.window()
          .ignoreRegions(By.id('overflowing-div')));

        testSetup.setExpectedIgnoreRegions(new Region(8, 80, 304, 184));
      });

      it('TestCheckWindowWithIgnoreBySelector_Centered_Fluent', async function () {
        await testSetup.getEyes().check('Fluent - Window with ignore region by selector centered', Target.window()
          .ignoreRegions(By.id('centered')));

        testSetup.setExpectedIgnoreRegions(new Region(122, 928, 456, 306));
      });

      it('TestCheckWindowWithIgnoreBySelector_Stretched_Fluent', async function () {
        await testSetup.getEyes().check('Fluent - Window with ignore region by selector stretched', Target.window()
          .ignoreRegions(By.id('stretched')));

        testSetup.setExpectedIgnoreRegions(new Region(8, 1270, 690, 206));
      });

      it('TestCheckWindowWithFloatingBySelector_Fluent', async function () {
        await testSetup.getEyes().check('Fluent - Window with floating region by selector', Target.window()
          .floatingRegion(By.id('overflowing-div'), 3, 3, 20, 30));

        testSetup.setExpectedIgnoreRegions(new FloatingMatchSettings({ left: 8, top: 80, width: 304, height: 184, maxUpOffset: 3, maxDownOffset: 3, maxLeftOffset: 20, maxRightOffset: 30 }));
      });

      it('TestCheckRegionByCoordinates_Fluent', async function () {
        await testSetup.getEyes().check('Fluent - Region by coordinates', Target.region(new Region(50, 70, 90, 110)));
      });

      it('TestCheckOverflowingRegionByCoordinates_Fluent', async function () {
        await testSetup.getEyes().check('Fluent - Region by overflowing coordinates', Target.region(new Region(50, 110, 90, 550)));
      });

      it('TestCheckElementWithIgnoreRegionByElementOutsideTheViewport_Fluent', async function () {
        const element = await testSetup.getDriver().findElement(By.id('overflowing-div-image'));
        const ignoreElement = await testSetup.getDriver().findElement(By.id('overflowing-div'));
        await testSetup.getEyes().check('Fluent - Region by element', Target.region(element).ignoreRegions(ignoreElement));
        testSetup.setExpectedIgnoreRegions(new Region(0, -202, 304, 184));
      });

      it('TestCheckElementWithIgnoreRegionBySameElement_Fluent', async function () {
        const element = await testSetup.getDriver().findElement(By.id('overflowing-div-image'));
        await testSetup.getEyes().check('Fluent - Region by element', Target.region(element).ignoreRegions(element));
        testSetup.setExpectedIgnoreRegions(new Region(0, 0, 304, 184));
      });

      it('TestScrollbarsHiddenAndReturned_Fluent', async function () {
        await testSetup.getEyes().check('Fluent - Window (Before)', Target.window().fully());
        await testSetup.getEyes().check('Fluent - Inner frame div', Target.frame('frame1')
          .region(By.id('inner-frame-div'))
          .fully());
        await testSetup.getEyes().check('Fluent - Window (After)', Target.window().fully());
      });

      it('TestCheckFullWindowWithMultipleIgnoreRegionsBySelector_Fluent', async function () {
        await testSetup.getEyes().check('Fluent - Region by element', Target.window().fully().ignoreRegions(By.css('.ignore')));
        testSetup.setExpectedIgnoreRegions(
          new Region(122, 928, 456, 306),
          new Region(8, 1270, 690, 206),
          new Region(10, 284, 800, 500)
        );
      });

      // TODO: not supported in JS yet
      // it('TestCheckMany', async function () {
      //   await testSetup.getEyes().check(
      //     Target.region(By.id("overflowing-div-image")).withName("overflowing div image"),
      //     Target.region(By.id("overflowing-div")).withName("overflowing div"),
      //     Target.region(By.id("overflowing-div-image")).fully().withName("overflowing div image (fully)"),
      //     Target.frame("frame1").frame("frame1-1").fully().withName("Full Frame in Frame"),
      //     Target.frame("frame1").withName("frame1"),
      //     Target.region(new Region(30, 50, 300, 620)).withName("rectangle")
      //   );
      // });

      it('TestCheckScrollableModal', async function () {
        testSetup.getDriver().findElement(By.id('centered')).Click();
        const scrollRootSelector = (row.stitchMode === StitchMode.CSS) ? By.id('modal-content') : By.id('modal1');
        await testSetup.getEyes().check('Scrollable Modal', Target.Region(By.id('modal-content')).fully().scrollRootElement(scrollRootSelector));
      });

      [
        { ignoreDisplacements: true },
        { ignoreDisplacements: false },
      ].forEach(({ ignoreDisplacements }) => {
        it(`TestIgnoreDisplacements: ${ignoreDisplacements}`, async function () {
          testSetup.setTestArguments({ ignoreDisplacements });
          await testSetup.getEyes().check(`Fluent - Ignore Displacements = ${ignoreDisplacements}`, Target.window()
            .ignoreDisplacements(ignoreDisplacements)
            .fully());
          testSetup.addExpectedProperty('ignoreDisplacements', ignoreDisplacements);
        });
      });

      it('TestCheckWindowWithFloatingByRegion_Fluent', async function () {
        await testSetup.getEyes().check('Fluent - Window with floating region by region', Target.window()
          .floatingRegion(new Region(10, 10, 20, 20), 3, 3, 20, 30));

        testSetup.setExpectedFloatingsRegions(new FloatingMatchSettings({ left: 10, top: 10, width: 20, height: 20, maxUpOffset: 3, maxDownOffset: 3, maxLeftOffset: 20, maxRightOffset: 30 }));
      });

      it('TestCheckElementFully_Fluent', async function () {
        const element = await testSetup.getDriver().findElement(By.id('overflowing-div-image'));
        await testSetup.getEyes().check('Fluent - Region by element - fully', Target.region(element).fully());
      });

      it('TestSimpleRegion', async function () {
        await testSetup.getEyes().check(undefined, Target.window().region(new Region(50, 50, 100, 100)));
      });

      it('TestAccessibilityRegions', async function () {
        const config = testSetup.getEyes().getConfiguration();
        config.setAccessibilityValidation(AccessibilityLevel.AAA);
        testSetup.getEyes().setConfiguration(config);

        await testSetup.getEyes().check(undefined, Target.window().accessibilityRegion(By.className('ignore'), AccessibilityRegionType.LargeText));

        testSetup.setExpectedAccessibilityRegions(
          new AccessibilityMatchSettings({ left: 122, top: 928, width: 456, height: 306, type: AccessibilityRegionType.LargeText }),
          new AccessibilityMatchSettings({ left: 8, top: 1270, width: 690, height: 206, type: AccessibilityRegionType.LargeText }),
          new AccessibilityMatchSettings({ left: 10, top: 284, width: 800, height: 500, type: AccessibilityRegionType.LargeText })
        );
        testSetup.addExpectedProperty('accessibilityLevel', AccessibilityLevel.AAA);
      });
    });
  });
});
