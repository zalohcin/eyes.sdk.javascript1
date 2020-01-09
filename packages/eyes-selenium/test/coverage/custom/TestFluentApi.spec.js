'use strict'
const {By} = require('selenium-webdriver')
const {getDriver, getEyes} = require('./util/testSetup')
const {
  Target,
  Region,
  BatchInfo,
  AccessibilityLevel,
  AccessibilityRegionType,
} = require('../../../index')
const appName = 'Test Fluent Api'
describe('Test ', () => {
  let driver, eyes
  let stitchMode = 'CSS'

  beforeEach(async function() {
    driver = await getDriver('CHROME')
    await driver.get('https://applitools.github.io/demo/TestPages/FramesTestPage/')
    let defaults = await getEyes('classic', stitchMode)
    eyes = defaults.eyes
    eyes.setBatch(new BatchInfo('JS test'))
  })

  afterEach(async function() {
    await eyes.abortIfNotClosed()
    await driver.quit()
  })

  it('TestCheckWindowWithIgnoreRegion_Fluent', async function() {
    await eyes.open(driver, appName, 'Fluent - Check Window with Ignore region', {
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
    await checkSettedRegionsInTheSessionsDetails()
  })

  it('TestCheckRegionWithIgnoreRegion_Fluent', async function() {
    await eyes.open(driver, appName, 'Fluent - Check Region with Ignore region', {
      width: 800,
      height: 600,
    })
    await eyes.check(
      'Fluent - Region with Ignore region',
      Target.region(By.id('overflowing-div')).ignoreRegions(new Region(50, 50, 100, 100)),
    )
    await eyes.close()
    await checkSettedRegionsInTheSessionsDetails()
  })

  it('TestCheckRegionBySelectorAfterManualScroll_Fluent', async function() {
    await eyes.open(driver, appName, 'Fluent - Region by selector after manual scroll', {
      width: 800,
      height: 600,
    })
    await driver.executeScript(() => window.scrollBy(0, 900))
    await eyes.check(
      'Fluent - Region by selector after manual scroll',
      Target.region(By.id('centered')),
    )
    await eyes.close()
  })

  it('TestCheckWindow_Fluent', async function() {
    await eyes.open(driver, appName, 'Fluent - Window', {
      width: 800,
      height: 600,
    })
    await eyes.check('Fluent - Window', Target.window())
    await eyes.close()
  })

  it('TestCheckWindowWithIgnoreBySelector_Fluent', async function() {
    await eyes.open(driver, appName, 'Fluent - Window with ignore region by selector', {
      width: 800,
      height: 600,
    })
    await eyes.check(
      'Fluent - Window with ignore region by selector',
      Target.window().ignoreRegions(By.id('overflowing-div')),
    )
    await eyes.close()
    await checkSettedRegionsInTheSessionsDetails()
  })

  it('TestCheckWindowWithIgnoreBySelector_Centered_Fluent', async function() {
    await eyes.open(driver, appName, 'Fluent - Window with ignore region by selector centered', {
      width: 800,
      height: 600,
    })
    await eyes.check(
      'Fluent - Window with ignore region by selector centered',
      Target.window().ignoreRegions(By.id('centered')),
    )
    await eyes.close()
    await checkSettedRegionsInTheSessionsDetails()
  })

  it('TestCheckWindowWithIgnoreBySelector_Stretched_Fluent', async function() {
    await eyes.open(driver, appName, 'Fluent - Window with ignore region by selector stretched', {
      width: 800,
      height: 600,
    })
    await eyes.check(
      'Fluent - Window with ignore region by selector stretched',
      Target.window().ignoreRegions(By.id('stretched')),
    )
    await eyes.close()
    await checkSettedRegionsInTheSessionsDetails()
  })

  it('TestCheckWindowWithFloatingBySelector_Fluent', async function() {
    await eyes.open(driver, appName, 'Fluent - Window with ignore region by selector', {
      width: 800,
      height: 600,
    })
    await eyes.check(
      'Fluent - Window with ignore region by selector',
      Target.window().floatingRegion(By.id('overflowing-div'), 3, 3, 20, 30),
    )
    await eyes.close()
    await checkSettedRegionsInTheSessionsDetails()
  })

  it('TestCheckRegionByCoordinates_Fluent', async function() {
    await eyes.open(driver, appName, 'Fluent - Region by coordinates', {
      width: 800,
      height: 600,
    })
    await eyes.check('Fluent - Region by coordinates', Target.region(new Region(50, 70, 90, 110)))
    await eyes.close()
  })

  it('TestCheckOverflowingRegionByCoordinates_Fluent', async function() {
    await eyes.open(driver, appName, 'Fluent - Region by overflowing coordinates', {
      width: 800,
      height: 600,
    })
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
      'Fluent - Region by element with ignore region by element outside the viewport',
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
    await checkSettedRegionsInTheSessionsDetails()
  })

  it('TestCheckElementWithIgnoreRegionBySameElement_Fluent', async function() {
    await eyes.open(
      driver,
      appName,
      'Fluent - Region by element with ignore region by the same element',
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
    await checkSettedRegionsInTheSessionsDetails()
  })

  it('TestScrollbarsHiddenAndReturned_Fluent', async function() {
    await eyes.open(driver, appName, 'Fluent - Scroll bars hidden and returned', {
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
    await eyes.open(driver, appName, 'Fluent - Window with multiple ignore regions by selectors', {
      width: 800,
      height: 600,
    })
    await eyes.check(
      'Fluent - Window with multiple ignore regions by selectors',
      Target.window()
        .fully()
        .ignoreRegions(By.css('.ignore')),
    )
    await eyes.close()
    await checkSettedRegionsInTheSessionsDetails()
  })

  it('TestCheckMany', async function() {
    await eyes.open(driver, appName, 'Fluent - Check many', {
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
    await eyes.open(driver, appName, 'Fluent - Scrollable Modal', {
      width: 800,
      height: 600,
    })
    driver.findElement(By.id('centered')).click()
    let scrollRootLocator = stitchMode === 'CSS' ? 'modal-content' : 'modal1'
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
      await eyes.open(driver, appName, `Fluent - Ignore displacement ${ignoreDisplacement}`, {
        width: 800,
        height: 600,
      })
      await eyes.check(
        `Fluent - Ignore displacement ${ignoreDisplacement}`,
        Target.window()
          .fully()
          .ignoreDisplacements(ignoreDisplacement),
      )
      await eyes.close()
      await checkSettedRegionsInTheSessionsDetails()
    })
  })

  it('TestCheckWindowWithFloatingByRegion_Fluent', async function() {
    await eyes.open(driver, appName, 'Fluent -  Window with floating region by region', {
      width: 800,
      height: 600,
    })
    let settings = Target.window().floatingRegion(new Region(10, 10, 20, 20), 3, 3, 20, 30)
    await eyes.check('Fluent -  Window with floating region by region', settings)
    await eyes.close()
  })

  it('TestCheckWindowWithFloatingByRegion_Fluent', async function() {
    await eyes.open(driver, appName, 'Fluent -  Window with floating region by region', {
      width: 800,
      height: 600,
    })
    let settings = Target.window().floatingRegion(new Region(10, 10, 20, 20), 3, 3, 20, 30)
    await eyes.check('Fluent -  Window with floating region by region', settings)
    await eyes.close()
    await checkSettedRegionsInTheSessionsDetails()
  })

  it('TestCheckElementFully_Fluent', async function() {
    await eyes.open(driver, appName, 'Fluent -  Region by element - fully', {
      width: 800,
      height: 600,
    })
    let element = driver.findElement(By.id('overflowing-div-image'))
    await eyes.check('Fluent -  Region by element - fully', Target.region(element).fully())
    await eyes.close()
  })

  it('TestSimpleRegion', async function() {
    await eyes.open(driver, appName, 'Fluent - Test Simple Region', {
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
    await eyes.open(driver, appName, 'Fluent - Test Accessibility Regions', {
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
    await checkSettedRegionsInTheSessionsDetails()
  })
})

async function checkSettedRegionsInTheSessionsDetails() {}
