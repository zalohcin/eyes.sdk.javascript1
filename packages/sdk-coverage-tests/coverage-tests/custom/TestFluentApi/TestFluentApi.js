'use strict'
const {expect} = require('chai')
const path = require('path')
const cwd = process.cwd()
const spec = require(path.resolve(cwd, 'src/SpecWrappedDriver'))
const {Target, Region} = require(cwd)
const {getApiData} = require('../../util/ApiAssertions')

async function getElementRect(webDriver, el) {
  try {
    return spec.getElementRect(webDriver, el)
  } catch (err) {
    const size = await el.getSize()
    const location = await el.getLocation()
    return {...size, ...location}
  }
}

async function performChecksOnLongRegion(rect, eyes) {
  for (let currentY = rect.y, c = 1; currentY < rect.y + rect.height; currentY += 5000, c++) {
    let region
    if (rect.height > currentY + 5000) {
      region = new Region(rect.x, currentY, rect.width, 5000)
    } else {
      region = new Region(rect.x, currentY, rect.width, rect.height - currentY)
    }
    await eyes.check('Check Long Out of bounds Iframe Modal', Target.region(region))
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

module.exports = {
  getElementRect: getElementRect,
  performChecksOnLongRegion: performChecksOnLongRegion,
  accessibilityRegionsApiAssertions: accessibilityRegionsApiAssertions,
}
