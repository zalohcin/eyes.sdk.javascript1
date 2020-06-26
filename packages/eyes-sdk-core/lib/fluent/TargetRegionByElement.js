'use strict'
const GetRegion = require('./GetRegion')
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
 * @template TElement, TSelector
 * @typedef {import('../wrappers/EyesWrappedElement')<any, TElement, TSelector>} EyesWrappedElement
 */

/**
 * @typedef {EyesSelector} TargetPersistedRegion
 */

/**
 * @internal
 * @template TElement
 * @template TSelector
 */
class TargetRegionByElement extends GetRegion {
  /**
   * @param {EyesWrappedElement<TElement, TSelector>} element
   */
  constructor(element) {
    super()
    this._element = element
  }
  /**
   * @template TDriver
   * @param {EyesWrappedDriver<TDriver, TElement, TSelector>} driver
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
