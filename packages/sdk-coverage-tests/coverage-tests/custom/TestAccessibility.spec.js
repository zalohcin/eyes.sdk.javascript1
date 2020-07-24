'use strict'
const cwd = process.cwd()
const assert = require('assert')
const path = require('path')
const {getEyes, Browsers} = require('../util/TestSetup')
const {getApiData} = require('../util/ApiAssertions')
const spec = require(path.resolve(cwd, 'src/SpecWrappedDriver'))
const {Target, AccessibilityRegionType} = require(cwd)

describe('Coverage tests', () => {
  let driver, eyes
  beforeEach(async () => {
    driver = await spec.build({capabilities: Browsers.chrome()})
  })

  it.skip('TestAccessibility', testAccessibility(true))
  it('TestAccessibility', testAccessibility(false))

  afterEach(async () => {
    await eyes.abortIfNotClosed()
    await spec.cleanup(driver)
  })

  function testAccessibility(isVisualGrid) {
    return async () => {
      eyes = await getEyes({isVisualGrid: isVisualGrid})
      const suffix = isVisualGrid ? '_VG' : ''
      const runner = eyes.getRunner()
      await spec.visit(driver, 'https://applitools.github.io/demo/TestPages/FramesTestPage/')
      const accessibilitySettings = {
        level: 'AA',
        guidelinesVersion: 'WCAG_2_0',
      }
      const config = eyes.getConfiguration()
      config.setAccessibilityValidation(accessibilitySettings)
      eyes.setConfiguration(config)
      await eyes.open(driver, 'Applitools Eyes SDK', `TestAccessibility_Sanity${suffix}`, {
        width: 700,
        height: 460,
      })

      const checkSettings = Target.window().accessibility(
        '.ignore',
        AccessibilityRegionType.LargeText,
      )

      await eyes.check('Sanity', checkSettings)
      await eyes.close(false)

      config.setAccessibilityValidation(null)
      eyes.setConfiguration(config)
      await eyes.open(
        driver,
        'Applitools Eyes SDK',
        `TestAccessibility_No_Accessibility${suffix}`,
        {
          width: 1200,
          height: 800,
        },
      )
      await eyes.checkWindow('No accessibility')
      await eyes.close(false)

      const testResults = await runner
        .getAllTestResults(false)
        .then(summary => summary.getAllResults())

      const resultSanity = testResults[0].getTestResults()
      const resultNoAccessibility = testResults[1].getTestResults()
      const sessionAccessibilityStatus = resultSanity.getAccessibilityStatus()
      assert.ok(sessionAccessibilityStatus)
      assert.ok(sessionAccessibilityStatus.status)
      assert.strictEqual(
        sessionAccessibilityStatus.version,
        accessibilitySettings.guidelinesVersion,
      )
      assert.strictEqual(sessionAccessibilityStatus.level, accessibilitySettings.level)

      const sessionResults = await getApiData(resultSanity)
      const [actualAppOutput] = sessionResults.actualAppOutput

      const expectedAccessibilityRegions = [
        {type: 'LargeText', isDisabled: false, left: 10, top: 284, width: 800, height: 500},
        {type: 'LargeText', isDisabled: false, left: 122, top: 928, width: 456, height: 306},
        {type: 'LargeText', isDisabled: false, left: 8, top: 1270, width: 690, height: 206},
      ]
      const expectedAccessibilitySettings = {
        level: 'AA',
        version: 'WCAG_2_0',
      }

      assert.deepStrictEqual(
        actualAppOutput.imageMatchSettings.accessibilitySettings,
        expectedAccessibilitySettings,
      )

      assert.deepStrictEqual(
        actualAppOutput.imageMatchSettings.accessibility,
        expectedAccessibilityRegions,
      )

      const noAccessibilityStatus = resultNoAccessibility.getAccessibilityStatus()
      assert.deepStrictEqual(typeof noAccessibilityStatus, 'undefined')
    }
  }
})
