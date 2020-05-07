'use strict'

const {Region, CoordinatesType} = require('@applitools/eyes-common')
const {GetRegion} = require('./GetRegion')
const EyesUtils = require('../EyesUtils')

/**
 * @typedef {import('../wrappers/EyesWrappedElement')} EyesWrappedElement
 * @typedef {import('../wrappers/EyesWrappedDriver')} EyesWrappedDriver
 */

class IgnoreRegionByElement extends GetRegion {
  /**
   * @param {EyesWrappedElement} element
   */
  constructor(element) {
    super()
    this._element = element
  }

  /**
   * @override
   * @param {EyesWrappedDriver} driver
   * @param {EyesScreenshot} screenshot
   * @return {Promise<Region[]>}
   */
  async getRegion(driver, screenshot) {
    await this._element.init(driver)
    const rect = await this._element.getRect()
    const lTag = screenshot.convertLocation(
      rect.getLocation(),
      CoordinatesType.CONTEXT_RELATIVE,
      CoordinatesType.SCREENSHOT_AS_IS,
    )
    return [new Region(lTag.getX(), lTag.getY(), rect.getWidth(), rect.getHeight())]
  }

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
