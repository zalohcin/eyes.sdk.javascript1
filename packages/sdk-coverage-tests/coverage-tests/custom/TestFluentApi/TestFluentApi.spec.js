'use strict'
const path = require('path')
const {getEyes, Browsers} = require('../../util/TestSetup')
const cwd = process.cwd()
const spec = require(path.resolve(cwd, 'src/SpecWrappedDriver'))
const {
  Target,
  Region,
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
describe(appName, () => {
  let webDriver, eyes
  let testCases = [true, false]

  afterEach(async () => {
    await eyes.abortIfNotClosed()
    await spec.cleanup(webDriver)
  })

  beforeEach(async () => {
    webDriver = await spec.build({capabilities: Browsers.chrome()})
    await spec.visit(webDriver, 'https://applitools.github.io/demo/TestPages/FramesTestPage/')
    eyes = await getEyes({isCssStitching: true})
  })

  testCases.forEach(ignoreDisplacement => {
    it('TestIgnoreDisplacements', async () => {
      await eyes.open(webDriver, appName, `TestIgnoreDisplacements`, {
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

  it('TestCheckRegionInFrame2_Fluent', async () => {
    await eyes.open(webDriver, appName, `TestCheckRegionInFrame2_Fluent`, {
      width: 700,
      height: 460,
    })
    await eyes.check(
      'Fluent - Inner frame div 1',
      Target.frame('frame1')
        .region('#inner-frame-div')
        .fully()
        .ignoreRegions(new Region(50, 50, 100, 100)),
    )
    await eyes.close()
  })

  it('TestCheckRegionInFrameInFrame_Fluent', async () => {
    await eyes.open(webDriver, appName, `TestCheckRegionInFrameInFrame_Fluent`, {
      width: 700,
      height: 460,
    })
    await eyes.check(
      'Fluent - Region in Frame in Frame',
      Target.frame('frame1')
        .frame('frame1-1')
        .region('img')
        .fully(),
    )
    await eyes.close()
  })

  it.skip('TestCheckScrollableModal', async () => {
    let driver = await eyes.open(webDriver, appName, `TestCheckScrollableModal`, {
      width: 700,
      height: 460,
    })
    const el = await spec.findElement(driver, '#centered')
    await spec.click(driver, el)
    await eyes.check(
      'TestCheckScrollableModal',
      Target.region('#modal-content')
        .fully()
        .scrollRootElement('#modal1'),
    )
    await eyes.close()
  })

  it.skip(`TestCheckLongIFrameModal`, async () => {
    let driver = await eyes.open(webDriver, appName, `TestCheckLongIFrameModal`, {
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

  it.skip(`TestCheckLongOutOfBoundsIFrameModal`, async () => {
    let driver = await eyes.open(webDriver, appName, `TestCheckLongOutOfBoundsIFrameModal`, {
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

  it('TestAccessibilityRegions', async () => {
    await eyes.open(webDriver, appName, 'TestAccessibilityRegions', {width: 700, height: 460})
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
