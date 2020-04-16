'use strict'
const {getDriver, getEyes, getBatch} = require('./util/TestSetup')
const {
  Configuration,
  BrowserType,
  AccessibilityLevel,
  AccessibilityVersion,
  DeviceName,
  MatchLevel,
} = require('../../../index')
const {assertDefaultMatchSettings, assertImageMatchSettings} = require('./util/ApiAssertions')
const {expect} = require('chai')
const batch = getBatch()

describe('TestVGServerConfigs', () => {
  let webDriver, eyes, runner

  beforeEach(async () => {
    webDriver = await getDriver('CHROME')
    ;({eyes, runner} = await getEyes('VG'))
  })

  afterEach(async () => {
    await webDriver.quit()
  })

  it(`TestVGDoubleCloseNoCheck`, async () => {
    let conf = new Configuration()
    conf.setBatch(batch)
    conf.setAppName('app')
    conf.setTestName('test')
    eyes.setConfiguration(conf)

    await eyes.open(webDriver)
    await eyes.close()
    await expect(eyes.close()).to.be.rejectedWith(Error, 'IllegalState: Eyes not open')
  })

  it('TestVGChangeConfigAfterOpen', async () => {
    let conf = new Configuration()
    conf.setBatch(batch)
    conf.setAppName('app')
    conf.setTestName('js test')

    conf.addBrowser(800, 600, BrowserType.CHROME)
    conf.addBrowser(1200, 800, BrowserType.CHROME)
    conf.addDeviceEmulation(DeviceName.Galaxy_S5)
    conf.addDeviceEmulation(DeviceName.Galaxy_S3)
    conf.addDeviceEmulation(DeviceName.iPhone_4)
    conf.addDeviceEmulation(DeviceName.iPhone_5SE)
    conf.addDeviceEmulation(DeviceName.iPad)

    conf
      .setAccessibilityValidation({
        level: AccessibilityLevel.AA,
        version: AccessibilityVersion.WCAG_2_0,
      })
      .setIgnoreDisplacements(false)
    eyes.setConfiguration(conf)

    await eyes.open(webDriver)

    conf
      .setAccessibilityValidation({
        level: AccessibilityLevel.AAA,
        version: AccessibilityVersion.WCAG_2_1,
      })
      .setIgnoreDisplacements(true)
    eyes.setConfiguration(conf)

    await eyes.checkWindow()

    conf
      .setAccessibilityValidation({
        level: AccessibilityLevel.AA,
        version: AccessibilityVersion.WCAG_2_0,
      })
      .setMatchLevel(MatchLevel.Layout)
    eyes.setConfiguration(conf)

    await eyes.checkWindow()
    await eyes.close(false)

    let summary = await runner.getAllTestResults(false)
    let results = await summary.getAllResults()
    expect(results.length).to.be.equal(7)
    for (let container of results) {
      let result = container.getTestResults()
      await assertDefaultMatchSettings(result, {
        accessibilitySettings: {
          level: AccessibilityLevel.AA,
          version: AccessibilityVersion.WCAG_2_0,
        },
        ignoreDisplacements: false,
        matchLevel: MatchLevel.Strict,
      })
      await assertImageMatchSettings(result, {
        accessibilitySettings: {
          level: AccessibilityLevel.AAA,
          version: AccessibilityVersion.WCAG_2_1,
        },
        ignoreDisplacements: true,
        matchLevel: MatchLevel.Strict,
      })
      await assertImageMatchSettings(
        result,
        {
          accessibilityLevel: {
            level: AccessibilityLevel.AA,
            version: AccessibilityVersion.WCAG_2_0,
          },
          ignoreDisplacements: true,
          matchLevel: MatchLevel.Layout2,
        },
        1,
      )
    }
  })
})
