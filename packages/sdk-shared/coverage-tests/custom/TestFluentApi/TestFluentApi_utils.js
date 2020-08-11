'use strict'
const path = require('path')
const cwd = process.cwd()
const spec = require(path.resolve(cwd, 'src/SpecDriver'))
const {expect} = require('chai')
const {getApiData} = require('../../util/ApiAssertions')
const {
  Target,
  Region,
  AccessibilityLevel,
  AccessibilityGuidelinesVersion,
  AccessibilityRegionType,
} = require(cwd)
const appName = 'Eyes Selenium SDK - Fluent API'

async function getElementSplittedRegions(driver, element) {
  function calculateElementRect(element) {
    const originalOverflow = element.style.overflow
    element.style.overflow = 'hidden'
    const rect = element.getBoundingClientRect()
    element.style = originalOverflow
    return {
      x: rect.left + window.scrollX, // eslint-disable-line no-undef
      y: rect.top + window.scrollY, // eslint-disable-line no-undef
      width: rect.width,
      height: rect.height,
    }
  }
  const region = await spec.executeScript(driver, calculateElementRect, element)
  const regions = []
  for (let currentY = region.y; currentY < region.y + region.height; currentY += 5000) {
    if (region.height > currentY + 5000) {
      regions.push(new Region(region.x, currentY, region.width, 5000))
    } else {
      regions.push(new Region(region.x, currentY, region.width, region.height - currentY))
    }
  }
  return regions
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

async function TestCheckScrollableModal({testName, eyes, driver}) {
  driver = await eyes.open(driver, appName, testName, {
    width: 700,
    height: 460,
  })
  await spec.click(driver, '#centered')
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
  await spec.click(driver, '#stretched')
  const frameElement = await spec.findElement(driver, '#modal2 iframe')
  const frameDriver = (await spec.childContext(driver, frameElement)) || driver
  const element = await spec.findElement(frameDriver, 'html')
  const regions = await getElementSplittedRegions(frameDriver, element)
  await spec.mainContext(driver)
  for (const region of regions) {
    await eyes.check({
      name: 'Check Long Out of bounds Iframe Modal',
      scrollRootElement: '#modal2',
      frames: [frameElement],
      region,
      isFully: true,
    })
  }
  await eyes.close()
}

async function TestCheckLongOutOfBoundsIFrameModal({testName, eyes, driver}) {
  driver = await eyes.open(driver, appName, testName, {
    width: 700,
    height: 460,
  })
  await spec.click(driver, '#hidden_click')
  const frameElement = await spec.findElement(driver, '#modal3 iframe')
  const frameDriver = (await spec.childContext(driver, frameElement)) || driver
  const element = await spec.findElement(frameDriver, 'html')
  const regions = await getElementSplittedRegions(frameDriver, element)
  await spec.mainContext(driver)
  for (const region of regions) {
    await eyes.check({
      name: 'Check Long Out of bounds Iframe Modal',
      scrollRootElement: '#modal3',
      frames: [frameElement],
      region,
      isFully: true,
    })
  }
  await eyes.close()
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
  TestCheckScrollableModal,
  TestCheckLongIFrameModal,
  TestCheckLongOutOfBoundsIFrameModal,
  TestAccessibilityRegions,
  TestIgnoreDisplacements,
  TestCheckRegionInFrame2_Fluent,
  TestCheckRegionInFrameInFrame_Fluent,
}
