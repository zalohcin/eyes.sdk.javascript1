'use strict'
const Region = require('../geometry/Region')
const CoordinatesTypes = require('../geometry/CoordinatesType')
const GetRegion = require('./GetRegion')
const EyesUtils = require('../EyesUtils')

/**
 * @typedef {import('../config/AccessibilityRegionType').AccessibilityRegionType} AccessibilityRegionType
 * @typedef {import('../wrappers/EyesWrappedElement').EyesSelector} EyesSelector
 * @typedef {import('../EyesClassic')} EyesClassic
 */

/**
 * @template Driver, Element, Selector
 * @typedef {import('../wrappers/EyesWrappedDriver')<Driver, Element, Selector>} EyesWrappedDriver
 */

/**
 * @typedef {EyesSelector} IgnorePersistedRegion
 */

/**
 * @internal
 * @template Selector
 */
class IgnoreRegionBySelector extends GetRegion {
  /**
   * @param {Selector} selector
   */
  constructor(selector) {
    super()
    this._selector = selector
  }
  /**
   * @param {EyesClassic} eyes
   * @param {EyesScreenshot} screenshot
   * @return {Promise<Region[]>}
   */
  async getRegion(eyes, screenshot) {
    // TODO eyes should be replaced with driver once all SDKs will use this implementation
    const elements = await eyes.getDriver().finder.findElements(this._selector)

    const regions = []
    for (const element of elements) {
      const rect = await element.getRect()
      const lTag = screenshot.convertLocation(
        rect.getLocation(),
        CoordinatesTypes.CONTEXT_RELATIVE,
        CoordinatesTypes.SCREENSHOT_AS_IS,
      )
      regions.push(new Region(lTag.getX(), lTag.getY(), rect.getWidth(), rect.getHeight()))
    }
    return regions
  }
  /**
   * @template Driver, Element
   * @param {EyesWrappedDriver<Driver, Element, Selector>} driver
   * @return {Promise<PersistedRegions[]>}
   */
  async toPersistedRegions(driver) {
    return EyesUtils.locatorToPersistedRegions(driver._logger, driver, this._selector)
  }
}

module.exports = IgnoreRegionBySelector
