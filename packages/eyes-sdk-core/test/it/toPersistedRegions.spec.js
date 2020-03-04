'use strict'

const assert = require('assert')
const {
  IgnoreRegionByRectangle,
  FloatingRegionByRectangle,
  AccessibilityRegionByRectangle,
  AccessibilityRegionType,
  Region,
} = require('../../index')

describe.only('toPersistedRegions()', function() {
  let driver
  before(() => {
    driver = {
      executeScript: async (_script, element) => `xpath of ${element}`,
      findElements: async locator => [`webelement of ${locator.value}`],
    }
  })

  it('IgnoreRegionByRectangle', async function() {
    const region = new IgnoreRegionByRectangle(
      new Region({left: 15, top: 15, width: 15, height: 15}),
    )
    const [{left, top, width, height}] = await region.toPersistedRegions(driver)
    assert.deepStrictEqual({left, top, width, height}, {left: 15, top: 15, width: 15, height: 15})
  })

  it('AccessibilityRegionByRectangle', async function() {
    const region = new AccessibilityRegionByRectangle(
      new Region({left: 15, top: 15, width: 15, height: 15}),
      AccessibilityRegionType.RegularText,
    )
    const [{left, top, width, height, accessibilityType}] = await region.toPersistedRegions(driver)
    assert.deepStrictEqual(
      {left, top, width, height, accessibilityType},
      {
        left: 15,
        top: 15,
        width: 15,
        height: 15,
        accessibilityType: AccessibilityRegionType.RegularText,
      },
    )
  })

  it('FloatingRegionByRectangle', async function() {
    const region = new FloatingRegionByRectangle(
      new Region({left: 15, top: 15, width: 15, height: 15}),
      1,
      2,
      3,
      4,
    )
    const [
      {left, top, width, height, maxUpOffset, maxDownOffset, maxLeftOffset, maxRightOffset},
    ] = await region.toPersistedRegions(driver)
    assert.deepStrictEqual(
      {left, top, width, height, maxUpOffset, maxDownOffset, maxLeftOffset, maxRightOffset},
      {
        left: 15,
        top: 15,
        width: 15,
        height: 15,
        maxUpOffset: 1,
        maxDownOffset: 2,
        maxLeftOffset: 3,
        maxRightOffset: 4,
      },
    )
  })
})
