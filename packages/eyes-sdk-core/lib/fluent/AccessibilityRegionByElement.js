'use strict'
const AccessibilityMatchSettings = require('../config/AccessibilityMatchSettings')
const CoordinatesTypes = require('../geometry/CoordinatesType')
const GetAccessibilityRegion = require('./GetAccessibilityRegion')
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
 * @typedef {EyesSelector & {accessibilityType: AccessibilityRegionType}} AccessibilityPersistedRegion
 */

/**
 * @internal
 * @template Element
 */
class AccessibilityRegionByElement extends GetAccessibilityRegion {
  /**
   * @param {EyesWrappedElement<Element>} element
   * @param {AccessibilityRegionType} [type]
   */
  constructor(element, type) {
    super()
    this._element = element
    this._type = type
  }
  /**
   * @param {EyesClassic} eyes
   * @param {EyesScreenshot} screenshot
   * @return {Promise<AccessibilityMatchSettings[]>}
   */
  async getRegion(eyes, screenshot) {
    // TODO eyes should be replaced with driver once all SDKs will use this implementation
    await this._element.init(eyes.getDriver())
    const rect = await this._element.getRect()
    const pTag = screenshot.convertLocation(
      rect.getLocation(),
      CoordinatesTypes.CONTEXT_RELATIVE,
      CoordinatesTypes.SCREENSHOT_AS_IS,
    )

    const accessibilityRegion = new AccessibilityMatchSettings({
      left: pTag.getX(),
      top: pTag.getY(),
      width: rect.getWidth(),
      height: rect.getHeight(),
      type: this._type,
    })
    return [accessibilityRegion]
  }
  /**
   * @template Driver, Selector
   * @param {EyesWrappedDriver<Driver, Element, Selector>} driver
   * @return {Promise<AccessibilityPersistedRegion[]>}
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
        accessibilityType: this._type,
      },
    ]
  }
}

module.exports = AccessibilityRegionByElement
