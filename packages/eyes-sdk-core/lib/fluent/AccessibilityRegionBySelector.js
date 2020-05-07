'use strict'

const {CoordinatesType, AccessibilityMatchSettings} = require('@applitools/eyes-common')
const {GetAccessibilityRegion} = require('./GetAccessibilityRegion')
const EyesUtils = require('../EyesUtils')

/**
 * @typedef {import('../wrappers/EyesWrappedElement').UniversalSelector} UniversalSelector
 * @typedef {import('../wrappers/EyesWrappedDriver')} EyesWrappedDriver
 */

class AccessibilityRegionBySelector extends GetAccessibilityRegion {
  /**
   * @param {UniversalSelector} selector
   * @param {AccessibilityRegionType} regionType
   */
  constructor(selector, regionType) {
    super()
    this._selector = selector
    this._regionType = regionType
  }

  /**
   * @param {EyesWrappedDriver} driver
   * @param {EyesScreenshot} screenshot
   * @return {Promise<AccessibilityMatchSettings[]>}
   */
  async getRegion(driver, screenshot) {
    const elements = await driver.finder.findElements(this._selector)

    const regions = []
    for (const element of elements) {
      const rect = await element.getRect()
      const lTag = screenshot.convertLocation(
        rect.getLocation(),
        CoordinatesType.CONTEXT_RELATIVE,
        CoordinatesType.SCREENSHOT_AS_IS,
      )
      const accessibilityRegion = new AccessibilityMatchSettings({
        left: lTag.getX(),
        top: lTag.getY(),
        width: rect.getWidth(),
        height: rect.getHeight(),
        type: this._regionType,
      })
      regions.push(accessibilityRegion)
    }

    return regions
  }

  /**
   * @param {EyesWrappedDriver} driver
   */
  async toPersistedRegions(driver) {
    const regions = await EyesUtils.locatorToPersistedRegions(
      driver._logger,
      driver,
      this._selector,
    )
    return regions.map(reg => ({
      ...reg,
      accessibilityType: this._regionType,
    }))
  }
}

module.exports = AccessibilityRegionBySelector
