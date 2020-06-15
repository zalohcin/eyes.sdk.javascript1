'use strict'
const path = require('path')
const cwd = process.cwd()
const spec = require(path.resolve(cwd, 'src/SpecWrappedDriver'))
const {
  Target,
  Region,
  AccessibilityLevel,
  AccessibilityGuidelinesVersion,
  AccessibilityRegionType,
} = require(cwd)
const {getApiData} = require('../../util/ApiAssertions')
const {expect} = require('chai')
const appName = 'Eyes Selenium SDK - Fluent API'

async function getElementRect(driver, el) {
  await spec.executeScript(driver, el => (el.style.overflow = 'hidden'), el)
  return spec.getElementRect(driver, el)
}

async function performChecksOnLongRegion(rect, eyes) {
  for (let currentY = rect.y, c = 1; currentY < rect.y + rect.height; currentY += 5000, c++) {
    let region
    if (rect.height > currentY + 5000) {
      region = new Region(rect.x, currentY, rect.width, 5000)
    } else {
      region = new Region(rect.x, currentY, rect.width, rect.height - currentY)
    }
    await eyes.check('Check Long Out of bounds Iframe Modal', Target.region(region).fully())
  }
}

async function accessibilityRegionsApiAssertions(results) {
  let data = await getApiData(results)
  let imageMatchSettings = data.actualAppOutput[0].imageMatchSettings
  expect(imageMatchSettings.accessibilitySettings.level).to.eql('AAA')
  expect(imageMatchSettings.accessibilitySettings.version).to.eql('WCAG_2_0')
  expect(imageMatchSettings.accessibility[0]).to.include({
    type: 'LargeText',
    left: 10,
    top: 284,
    width: 800,
    height: 500,
  })
  expect(imageMatchSettings.accessibility[1]).to.include({
    type: 'LargeText',
    left: 122,
    top: 928,
    width: 456,
    height: 306,
  })
  expect(imageMatchSettings.accessibility[2]).to.include({
    type: 'LargeText',
    left: 8,
    top: 1270,
    width: 690,
    height: 206,
  })
}

async function TestCheckRegionInFrame2_Fluent({testName, eyes, driver}) {
  await eyes.open(driver, appName, testName, {
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
  await eyes.check(
    'Fluent - Inner frame div 2',
    Target.frame('frame1')
      .region('#inner-frame-div')
      .fully()
      .ignoreRegion(new Region(50, 50, 100, 100))
      .ignoreRegion(new Region(70, 170, 90, 90)),
  )
  await eyes.check(
    'Fluent - Inner frame div 3',
    Target.frame('frame1')
      .region('#inner-frame-div')
      .fully()
      .timeout(5000),
  )
  await eyes.check(
    'Fluent - Inner frame div 4',
    Target.frame('frame1')
      .region('#inner-frame-div')
      .fully(),
  )
  await eyes.check(
    'Fluent - Full frame with floating region',
    Target.frame('frame1')
      .fully()
      .layout()
      .floatingRegion(new Region(200, 200, 150, 150), 25),
  )
  await eyes.close()
}

async function TestCheckRegionInFrameInFrame_Fluent({testName, eyes, driver}) {
  await eyes.open(driver, appName, testName, {
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
}

async function TestCheckScrollableModal({testName, eyes, driver}) {
  driver = await eyes.open(driver, appName, testName, {
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
}

async function TestCheckLongIFrameModal({testName, eyes, driver}) {
  driver = await eyes.open(driver, appName, testName, {
    width: 700,
    height: 460,
  })
  const el = await spec.findElement(driver, '#stretched')
  await spec.click(driver, el)
  let frame = await spec.findElement(driver, '#modal2 iframe')
  await spec.switchToFrame(driver, frame)
  let element = await spec.findElement(driver, 'html')
  let rect = await getElementRect(driver, element)
  eyes.setScrollRootElement('#modal2')
  await performChecksOnLongRegion(rect, eyes)
  await eyes.close()
}

async function TestCheckLongOutOfBoundsIFrameModal({testName, eyes, driver}) {
  driver = await eyes.open(driver, appName, testName, {
    width: 700,
    height: 460,
  })
  const el = await spec.findElement(driver, '#hidden_click')
  await spec.click(driver, el)
  let frame = await spec.findElement(driver, '#modal3 iframe')
  await spec.switchToFrame(driver, frame)
  let element = await spec.findElement(driver, 'html')
  let rect = await getElementRect(driver, element)
  eyes.setScrollRootElement('#modal3')
  await performChecksOnLongRegion(rect, eyes)
  await eyes.close()
}

async function TestAccessibilityRegions({testName, eyes, driver}) {
  await eyes.open(driver, appName, testName, {width: 700, height: 460})
  let config = eyes.getConfiguration()
  config.setAccessibilityValidation({
    level: AccessibilityLevel.AAA,
    guidelinesVersion: AccessibilityGuidelinesVersion.WCAG_2_0,
  })
  eyes.setConfiguration(config)
  let regions = await spec.findElements(driver, '.ignore')
  await eyes.check(
    '',
    Target.window()
      .accessibilityRegion(regions[0], AccessibilityRegionType.LargeText)
      .accessibilityRegion(regions[1], AccessibilityRegionType.LargeText)
      .accessibilityRegion(regions[2], AccessibilityRegionType.LargeText),
  )
  let result = await eyes.close()
  await accessibilityRegionsApiAssertions(result)
}

async function TestIgnoreDisplacements({testName, eyes, driver, ignoreDisplacement}) {
  await eyes.open(driver, appName, testName, {
    width: 700,
    height: 460,
  })
  await eyes.check(
    `Fluent - Ignore Displacement = ${ignoreDisplacement}`,
    Target.window()
      .ignoreDisplacements(ignoreDisplacement)
      .fully(),
  )
}

module.exports = {
  getElementRect,
  TestCheckScrollableModal,
  TestCheckLongIFrameModal,
  TestCheckLongOutOfBoundsIFrameModal,
  TestAccessibilityRegions,
  TestIgnoreDisplacements,
  TestCheckRegionInFrame2_Fluent,
  TestCheckRegionInFrameInFrame_Fluent,
}
