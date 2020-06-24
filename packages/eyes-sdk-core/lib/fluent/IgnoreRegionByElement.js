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
 * @template Element
 * @typedef {import('../wrappers/EyesWrappedElement')<any, Element, any>} EyesWrappedElement
 */

/**
 * @typedef {EyesSelector} IgnorePersistedRegion
 */

/**
 * @internal
 * @template Element
 */
class IgnoreRegionByElement extends GetRegion {
  /**
   * @param {EyesWrappedElement<Element>} element
   */
  constructor(element) {
    super()
    this._element = element
  }
  /**
   * @param {EyesClassic} eyes
   * @param {EyesScreenshot} screenshot
   * @return {Promise<Region[]>}
   */
  async getRegion(eyes, screenshot) {
    // TODO eyes should be replaced with driver once all SDKs will use this implementation
    await this._element.init(eyes.getDriver())
    const rect = await this._element.getRect()
    const lTag = screenshot.convertLocation(
      rect.getLocation(),
      CoordinatesTypes.CONTEXT_RELATIVE,
      CoordinatesTypes.SCREENSHOT_AS_IS,
    )
    return [new Region(lTag.getX(), lTag.getY(), rect.getWidth(), rect.getHeight())]
  }
  /**
   * @template Driver, Selector
   * @param {EyesWrappedDriver<Driver, Element, Selector>} driver
   * @return {Promise<IgnorePersistedRegion[]>}
   */
  async toPersistedRegions(driver) {
    const xpath = await EyesUtils.getElementAbsoluteXpath(
      driver._logger,
      driver.executor,
      this._element,
    )
    return [{type: 'xpath', selector: xpath}]
  }
}

module.exports = IgnoreRegionByElement
