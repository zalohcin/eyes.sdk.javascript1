'use strict'
const {ApiAssertion} = require('./util/ApiAssertions')
const Rectangle = require('./util/Rectangle')
const FloatingRectangle = require('./util/FloatingRectangle')
const AccessibilityRectangle = require('./util/AccessibilityRectangle')
const {By} = require('selenium-webdriver')
const {getDriver, getEyes} = require('./util/TestSetup')
const {
  Target,
  Region,
  BatchInfo,
  AccessibilityLevel,
  AccessibilityRegionType,
} = require('../../../index')
const appName = 'Test Fluent Api'
describe(appName, () => {
  let setups = [
    // {stitchMode: 'CSS', runnerType: 'classic', title: ''},
    {stitchMode: 'SCROLL', runnerType: 'classic', title: ' (SCROLL)'},
    // {stitchMode: 'SCROLL', runnerType: 'visualGrid', title: ' (VG)'},
  ]
  let batch = new BatchInfo('JS test')
  setups.forEach(function(setup) {
    describe(`Test run ${setup.title}`, () => {
      let driver, eyes, runner
      beforeEach(async function() {
        driver = await getDriver('CHROME')
        await driver.get('https://applitools.github.io/demo/TestPages/FramesTestPage/')
        let defaults = await getEyes(setup.runnerType, setup.stitchMode)
        eyes = defaults.eyes
        runner = defaults.runner
        eyes.setBatch(batch)
      })

      afterEach(async function() {
        await eyes.abortIfNotClosed()
        await driver.quit()
      })

      it('TestCheckWindowWithIgnoreRegion_Fluent', async function() {
        await eyes.open(driver, appName, `Fluent - Check Window with Ignore region${setup.title}`, {
          width: 800,
          height: 600,
        })
        await driver.findElement(By.css('input')).sendKeys('My Input')
        await eyes.check(
          'Fluent - Window with Ignore region',
          Target.window()
            .fully()
            .timeout(5)
            .ignoreCaret()
            .ignoreRegions(new Region(50, 50, 100, 100)),
        )
        await eyes.close()
        let summary = await runner.getAllTestResults()
        await ApiAssertion(summary, {
          ignore: [new Rectangle(50, 50, 100, 100)],
        })
      })

      it('TestCheckRegionWithIgnoreRegion_Fluent', async function() {
        await eyes.open(driver, appName, `Fluent - Check Region with Ignore region${setup.title}`, {
          width: 800,
          height: 600,
        })
        await eyes.check(
          'Fluent - Region with Ignore region',
          Target.region(By.id('overflowing-div')).ignoreRegions(new Region(50, 50, 100, 100)),
        )
        await eyes.close()
        let summary = await runner.getAllTestResults()
        await ApiAssertion(summary, {
          ignore: [new Rectangle(50, 50, 100, 100)],
        })
      })

      it('TestCheckRegionBySelectorAfterManualScroll_Fluent', async function() {
        await eyes.open(
          driver,
          appName,
          `Fluent - Region by selector after manual scroll${setup.title}`,
          {
            width: 800,
            height: 600,
          },
        )
        await driver.executeScript(() => window.scrollBy(0, 900))
        await eyes.check(
          'Fluent - Region by selector after manual scroll',
          Target.region(By.id('centered')),
        )
        await eyes.close()
      })

      it('TestCheckWindow_Fluent', async function() {
        await eyes.open(driver, appName, `Fluent - Window${setup.title}`, {
          width: 800,
          height: 600,
        })
        await eyes.check('Fluent - Window', Target.window())
        await eyes.close()
      })

      it('TestCheckWindowWithIgnoreBySelector_Fluent', async function() {
        await eyes.open(
          driver,
          appName,
          `Fluent - Window with ignore region by selector${setup.title}`,
          {
            width: 800,
            height: 600,
          },
        )
        await eyes.check(
          'Fluent - Window with ignore region by selector',
          Target.window().ignoreRegions(By.id('overflowing-div')),
        )
        await eyes.close()
        let summary = await runner.getAllTestResults()
        await ApiAssertion(summary, {
          ignore: [new Rectangle(8, 80, 304, 184)],
        })
      })

      it('TestCheckWindowWithIgnoreBySelector_Centered_Fluent', async function() {
        await eyes.open(
          driver,
          appName,
          `Fluent - Window with ignore region by selector centered${setup.title}`,
          {
            width: 800,
            height: 600,
          },
        )
        await eyes.check(
          'Fluent - Window with ignore region by selector centered',
          Target.window().ignoreRegions(By.id('centered')),
        )
        await eyes.close()
        let summary = await runner.getAllTestResults()
        await ApiAssertion(summary, {
          ignore: [new Rectangle(122, 928, 456, 306)],
        })
      })

      it('TestCheckWindowWithIgnoreBySelector_Stretched_Fluent', async function() {
        await eyes.open(
          driver,
          appName,
          `Fluent - Window with ignore region by selector stretched${setup.title}`,
          {
            width: 800,
            height: 600,
          },
        )
        await eyes.check(
          'Fluent - Window with ignore region by selector stretched',
          Target.window().ignoreRegions(By.id('stretched')),
        )
        await eyes.close()
        let summary = await runner.getAllTestResults()
        await ApiAssertion(summary, {
          ignore: [new Rectangle(8, 1270, 690, 206)],
        })
      })

      it('TestCheckWindowWithFloatingBySelector_Fluent', async function() {
        await eyes.open(
          driver,
          appName,
          `Fluent - Window with ignore region by selector${setup.title}`,
          {
            width: 800,
            height: 600,
          },
        )
        await eyes.check(
          'Fluent - Window with ignore region by selector',
          Target.window().floatingRegion(By.id('overflowing-div'), 3, 3, 20, 30),
        )
        await eyes.close()
        let summary = await runner.getAllTestResults()
        await ApiAssertion(summary, {
          floating: [new FloatingRectangle(8, 80, 304, 184, 3, 3, 20, 30)],
        })
      })

      it('TestCheckRegionByCoordinates_Fluent', async function() {
        await eyes.open(driver, appName, `Fluent - Region by coordinates${setup.title}`, {
          width: 800,
          height: 600,
        })
        await eyes.check(
          'Fluent - Region by coordinates',
          Target.region(new Region(50, 70, 90, 110)),
        )
        await eyes.close()
      })

      it('TestCheckOverflowingRegionByCoordinates_Fluent', async function() {
        await eyes.open(
          driver,
          appName,
          `Fluent - Region by overflowing coordinates${setup.title}`,
          {
            width: 800,
            height: 600,
          },
        )
        await eyes.check(
          'Fluent - Region by overflowing coordinates',
          Target.region(new Region(50, 110, 90, 550)),
        )
        await eyes.close()
      })

      it('TestCheckElementWithIgnoreRegionByElementOutsideTheViewport_Fluent', async function() {
        await eyes.open(
          driver,
          appName,
          `Fluent - Region by element with ignore region by element outside the viewport${setup.title}`,
          {
            width: 800,
            height: 600,
          },
        )
        let element = driver.findElement(By.id('overflowing-div-image'))
        let ignoreElement = driver.findElement(By.id('overflowing-div'))
        await eyes.check(
          'Fluent - Region by element with ignore region by element outside the viewport',
          Target.region(element).ignoreRegions(ignoreElement),
        )
        await eyes.close()
        let summary = await runner.getAllTestResults()
        await ApiAssertion(summary, {
          ignore: [new Rectangle(0, -202, 304, 184)],
        })
      })

      it('TestCheckElementWithIgnoreRegionBySameElement_Fluent', async function() {
        await eyes.open(
          driver,
          appName,
          `Fluent - Region by element with ignore region by the same element${setup.title}`,
          {
            width: 800,
            height: 600,
          },
        )
        let element = driver.findElement(By.id('overflowing-div-image'))
        await eyes.check(
          'Fluent - Region by element with ignore region by the same element',
          Target.region(element).ignoreRegions(element),
        )
        await eyes.close()
        let results = await runner.getAllTestResults()
        await ApiAssertion(results, {
          ignore: [new Rectangle(0, 0, 304, 184)],
        })
      })

      it('TestScrollbarsHiddenAndReturned_Fluent', async function() {
        await eyes.open(driver, appName, `Fluent - Scroll bars hidden and returned${setup.title}`, {
          width: 800,
          height: 600,
        })
        await eyes.check('Fluent - Window (Before)', Target.window().fully())
        await eyes.check(
          'Fluent - Inner frame div',
          Target.frame('frame1')
            .region(By.id('inner-frame-div'))
            .fully(),
        )
        await eyes.check('Fluent - Window (After)', Target.window().fully())
        await eyes.close()
      })

      it('TestCheckFullWindowWithMultipleIgnoreRegionsBySelector_Fluent', async function() {
        await eyes.open(
          driver,
          appName,
          `Fluent - Window with multiple ignore regions by selectors${setup.title}`,
          {
            width: 800,
            height: 600,
          },
        )
        await eyes.check(
          `Fluent - Window with multiple ignore regions by selectors`,
          Target.window()
            .fully()
            .ignoreRegions(By.css('.ignore')),
        )
        await eyes.close()
        let summary = await runner.getAllTestResults()
        await ApiAssertion(summary, {
          ignore: [
            new Rectangle(10, 284, 800, 500),
            new Rectangle(122, 928, 456, 306),
            new Rectangle(8, 1270, 690, 206),
          ],
        })
      })

      it('TestCheckMany', async function() {
        await eyes.open(driver, appName, `Fluent - Check many${setup.title}`, {
          width: 800,
          height: 600,
        })
        await eyes.check(
          'Fluent - Check many',
          Target.region(By.id('overflowing-div-image')).withName('overflowing div image'),
          Target.region(By.id('overflowing-div-image'))
            .fully()
            .withName('overflowing div image (fully)'),
          Target.region(By.id('overflowing-div')).withName('overflowing div'),
          Target.region(new Region(30, 50, 300, 620)).withName('rectangle'),
          Target.frame('frame1')
            .frame('frame1-1')
            .fully()
            .withName('Full Frame in Frame'),
          Target.frame('frame1').withName('frame1'),
        )
        await eyes.close()
      })

      it('TestCheckScrollableModal', async function() {
        await eyes.open(driver, appName, `Fluent - Scrollable Modal${setup.title}`, {
          width: 800,
          height: 600,
        })
        driver.findElement(By.id('centered')).click()
        let scrollRootLocator = setup.stitchMode === 'CSS' ? 'modal-content' : 'modal1'
        let scrollRootSelector = By.id(scrollRootLocator)
        await eyes.check(
          'Fluent - Scrollable Modal',
          Target.region(By.id('modal-content'))
            .fully()
            .scrollRootElement(scrollRootSelector),
        )
        await eyes.close()
      })

      let ignoreDisplacements = [true, false]

      ignoreDisplacements.forEach(function(ignoreDisplacement) {
        it(`TestIgnoreDisplacements ${ignoreDisplacement}`, async function() {
          await eyes.open(
            driver,
            appName,
            `Fluent - Ignore displacement ${ignoreDisplacement}${setup.title}`,
            {
              width: 800,
              height: 600,
            },
          )
          await eyes.check(
            `Fluent - Ignore displacement ${ignoreDisplacement}`,
            Target.window()
              .fully()
              .ignoreDisplacements(ignoreDisplacement),
          )
          await eyes.close()
          let results = await runner.getAllTestResults()
          await ApiAssertion(results, {
            ignoreDisplacements: ignoreDisplacement,
          })
        })
      })

      it('TestCheckWindowWithFloatingByRegion_Fluent', async function() {
        await eyes.open(
          driver,
          appName,
          `Fluent -  Window with floating region by region${setup.title}`,
          {
            width: 800,
            height: 600,
          },
        )
        let settings = Target.window().floatingRegion(new Region(10, 10, 20, 20), 3, 3, 20, 30)
        await eyes.check('Fluent -  Window with floating region by region', settings)
        await eyes.close()
        let summary = await runner.getAllTestResults()
        await ApiAssertion(summary, {
          floating: [new FloatingRectangle(10, 10, 20, 20, 3, 3, 20, 30)],
        })
      })

      it('TestCheckElementFully_Fluent', async function() {
        await eyes.open(driver, appName, `Fluent -  Region by element - fully${setup.title}`, {
          width: 800,
          height: 600,
        })
        let element = driver.findElement(By.id('overflowing-div-image'))
        await eyes.check('Fluent -  Region by element - fully', Target.region(element).fully())
        await eyes.close()
      })

      it('TestSimpleRegion', async function() {
        await eyes.open(driver, appName, `Fluent - Test Simple Region${setup.title}`, {
          width: 800,
          height: 600,
        })
        await eyes.check(
          'Fluent - Test Simple Region',
          Target.window().region(new Region(50, 50, 100, 100)),
        )
        await eyes.close()
      })

      it('TestAccessibilityRegions', async function() {
        let config = eyes.getConfiguration()
        config.setAccessibilityValidation(AccessibilityLevel.AAA)
        eyes.setConfiguration(config)
        await eyes.open(driver, appName, `Fluent - Test Accessibility Regions${setup.title}`, {
          width: 800,
          height: 600,
        })
        await eyes.check(
          'Fluent - Test Accessibility Regions',
          Target.window().accessibilityRegion(
            By.className('ignore'),
            AccessibilityRegionType.LargeText,
          ),
        )
        await eyes.close()
        let summary = await runner.getAllTestResults()
        await ApiAssertion(summary, {
          accessibility: [
            new AccessibilityRectangle(10, 284, 800, 500, false, 'LargeText'),
            new AccessibilityRectangle(122, 928, 456, 306, false, 'LargeText'),
            new AccessibilityRectangle(8, 1270, 690, 206, false, 'LargeText'),
          ],
          accessibilityLevel: 'AAA',
        })
      })
    })
  })
})
