'use strict'
const path = require('path')
const {getEyes, Browsers} = require('../../util/TestSetup')
const cwd = process.cwd()
const spec = require(path.resolve(cwd, 'src/SpecWrappedDriver'))
const {
  Target,
  AccessibilityLevel,
  AccessibilityGuidelinesVersion,
  AccessibilityRegionType,
} = require(cwd)
const {
  getElementRect,
  performChecksOnLongRegion,
  accessibilityRegionsApiAssertions,
} = require('./TestFluentApi')

const appName = 'Eyes Selenium SDK - Fluent API'
describe(`${appName} VG`, () => {
  let webDriver, eyes
  let testCases = [true, false]

  afterEach(async function() {
    await eyes.abortIfNotClosed()
    await spec.cleanup(webDriver)
  })
  beforeEach(async function() {
    webDriver = await spec.build({capabilities: Browsers.chrome()})
    await spec.visit(webDriver, 'https://applitools.github.io/demo/TestPages/FramesTestPage/')
    eyes = await getEyes({isVisualGrid: true})
  })

  testCases.forEach(ignoreDisplacement => {
    it('TestIgnoreDisplacements', async () => {
      await eyes.open(webDriver, appName, `TestIgnoreDisplacements_VG`, {
        width: 700,
        height: 460,
      })
      await eyes.check(
        `Fluent - Ignore Displacement = ${ignoreDisplacement}`,
        Target.window()
          .ignoreDisplacements(ignoreDisplacement)
          .fully(),
      )
    })
  })

  it('TestCheckScrollableModal', async () => {
    let driver = await eyes.open(webDriver, appName, `TestCheckScrollableModal_VG`, {
      width: 700,
      height: 460,
    })
    const el = await spec.findElement(driver, '#centered')
    await spec.click(driver, el)
    await eyes.check(
      'TestCheckScrollableModal',
      Target.region('#modal-content')
        .fully()
        .scrollRootElement('#modal-content'),
    )
    await eyes.close()
  })

  it(`TestCheckLongIFrameModal`, async () => {
    let driver = await eyes.open(webDriver, appName, `TestCheckLongIFrameModal_VG`, {
      width: 700,
      height: 460,
    })
    const el = await spec.findElement(driver, '#stretched')
    await spec.click(driver, el)
    let frame = await spec.findElement(driver, '#modal2 iframe')
    await spec.switchToFrame(driver, frame)
    let element = await spec.findElement(driver, 'html')
    let rect = await getElementRect(webDriver, element)
    await performChecksOnLongRegion(rect, eyes)
    await eyes.close()
  })

  it(`TestCheckLongOutOfBoundsIFrameModal`, async () => {
    let driver = await eyes.open(webDriver, appName, `TestCheckLongOutOfBoundsIFrameModal_VG`, {
      width: 700,
      height: 460,
    })
    const el = await spec.findElement(driver, '#hidden_click')
    await spec.click(driver, el)
    let frame = await spec.findElement(driver, '#modal3 iframe')
    await spec.switchToFrame(driver, frame)
    let element = await spec.findElement(driver, 'html')
    let rect = await getElementRect(webDriver, element)
    await performChecksOnLongRegion(rect, eyes)
    await eyes.close()
  })

  it.skip('TestAccessibilityRegions', async () => {
    await eyes.open(webDriver, appName, 'TestAccessibilityRegions_VG', {width: 700, height: 460})
    let config = eyes.getConfiguration()
    config.setAccessibilityValidation({
      level: AccessibilityLevel.AAA,
      guidelinesVersion: AccessibilityGuidelinesVersion.WCAG_2_0,
    })
    eyes.setConfiguration(config)
    let regions = await spec.findElements(webDriver, '.ignore')
    await eyes.check(
      '',
      Target.window()
        .accessibilityRegion(regions[0], AccessibilityRegionType.LargeText)
        .accessibilityRegion(regions[1], AccessibilityRegionType.LargeText)
        .accessibilityRegion(regions[2], AccessibilityRegionType.LargeText),
    )
    let result = await eyes.close()
    await accessibilityRegionsApiAssertions(result)
  })
})
