'use strict'

const {CoordinatesType, Region} = require('@applitools/eyes-common')
const {GetRegion} = require('./GetRegion')
const EyesUtils = require('../EyesUtils')

/**
 * @typedef {import('../wrappers/EyesWrappedElement').UniversalSelector} UniversalSelector
 * @typedef {import('../wrappers/EyesWrappedDriver')} EyesWrappedDriver
 */

class IgnoreRegionBySelector extends GetRegion {
  /**
   * @param {By} selector
   */
  constructor(selector) {
    super()
    this._selector = selector
  }

  /**
   * @param {EyesWrappedDriver} driver
   * @param {EyesScreenshot} screenshot
   * @return {Promise<Region[]>}
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
      regions.push(new Region(lTag.getX(), lTag.getY(), rect.getWidth(), rect.getHeight()))
    }
    return regions
  }

  async toPersistedRegions(driver) {
    return EyesUtils.locatorToPersistedRegions(driver._logger, driver, this._selector)
  }
}

module.exports = IgnoreRegionBySelector
