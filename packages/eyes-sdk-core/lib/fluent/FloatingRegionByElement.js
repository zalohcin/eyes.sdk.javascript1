'use strict'
const CoordinatesType = require('../geometry/CoordinatesType')
const FloatingMatchSettings = require('../config/FloatingMatchSettings')
const GetFloatingRegion = require('./GetFloatingRegion')
const EyesUtils = require('../EyesUtils')

/**
 * @typedef {import('../config/AccessibilityRegionType').AccessibilityRegionType} AccessibilityRegionType
 * @typedef {import('../wrappers/EyesWrappedElement').EyesSelector} EyesSelector
 * @typedef {import('../EyesClassic')} EyesClassic
 */

/**
 * @template TDriver, TElement, TSelector
 * @typedef {import('../wrappers/EyesWrappedDriver')<TDriver, TElement, TSelector>} EyesWrappedDriver
 */

/**
 * @template TElement
 * @typedef {import('../wrappers/EyesWrappedElement')<any, TElement, any>} EyesWrappedElement
 */

/**
 * @typedef {EyesSelector & {maxUpOffset: number, maxDownOffset: number, maxLeftOffset: number, maxRightOffset: number}} FloatingPersistedRegion
 */

/**
 * @internal
 * @template TElement
 */
class FloatingRegionByElement extends GetFloatingRegion {
  /**
   * @param {EyesWrappedElement<TElement>} element
   * @param {number} maxUpOffset
   * @param {number} maxDownOffset
   * @param {number} maxLeftOffset
   * @param {number} maxRightOffset
   */
  constructor(element, maxUpOffset, maxDownOffset, maxLeftOffset, maxRightOffset) {
    super()
    this._element = element
    this._maxUpOffset = maxUpOffset
    this._maxDownOffset = maxDownOffset
    this._maxLeftOffset = maxLeftOffset
    this._maxRightOffset = maxRightOffset
  }
  /**
   * @param {EyesClassic} eyes
   * @param {EyesScreenshot} screenshot
   * @return {Promise<FloatingMatchSettings[]>}
   */
  async getRegion(eyes, screenshot) {
    // TODO eyes should be replaced with driver once all SDKs will use this implementation
    await this._element.init(eyes.getDriver())
    const rect = await this._element.getRect()
    const lTag = screenshot.convertLocation(
      rect.getLocation(),
      CoordinatesType.CONTEXT_RELATIVE,
      CoordinatesType.SCREENSHOT_AS_IS,
    )

    const floatingRegion = new FloatingMatchSettings({
      left: lTag.getX(),
      top: lTag.getY(),
      width: rect.getWidth(),
      height: rect.getHeight(),
      maxUpOffset: this._maxUpOffset,
      maxDownOffset: this._maxDownOffset,
      maxLeftOffset: this._maxLeftOffset,
      maxRightOffset: this._maxRightOffset,
    })
    return [floatingRegion]
  }
  /**
   * @template TDriver, TSelector
   * @param {EyesWrappedDriver<TDriver, TElement, TSelector>} driver
   * @return {Promise<FloatingPersistedRegion[]>}
   */
  async toPersistedRegions(driver) {
    const xpath = await EyesUtils.getElementAbsoluteXpath(
      driver._logger,
      driver.executor,
      this._element,
    )
    return [
      {
        type: 'xpath',
        selector: xpath,
        maxUpOffset: this._maxUpOffset,
        maxDownOffset: this._maxDownOffset,
        maxLeftOffset: this._maxLeftOffset,
        maxRightOffset: this._maxRightOffset,
      },
    ]
  }
}

module.exports = FloatingRegionByElement
