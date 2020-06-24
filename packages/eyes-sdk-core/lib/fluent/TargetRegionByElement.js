'use strict'
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
 * @template Element, Selector
 * @typedef {import('../wrappers/EyesWrappedElement')<any, Element, Selector>} EyesWrappedElement
 */

/**
 * @typedef {EyesSelector} TargetPersistedRegion
 */

/**
 * @internal
 * @template Element
 * @template Selector
 */
class TargetRegionByElement extends GetRegion {
  /**
   * @param {EyesWrappedElement<Element, Selector>} element
   */
  constructor(element) {
    super()
    this._element = element
  }
  /**
   * @template Driver
   * @param {EyesWrappedDriver<Driver, Element, Selector>} driver
   * @return {Promise<TargetPersistedRegion[]>}
   */
  async toPersistedRegions(driver) {
    await this._element.init(driver)
    const xpath = await EyesUtils.getElementAbsoluteXpath(
      driver._logger,
      driver.executor,
      this._element,
    )
    return [{type: 'xpath', selector: xpath}]
  }
}

module.exports = TargetRegionByElement
