'use strict'

const {GeneralUtils} = require('@applitools/eyes-common')
const {GetSelector} = require('./GetSelector')
const EyesUtils = require('../EyesUtils')

const EYES_SELECTOR_TAG = 'data-eyes-selector'

/**
 * @typedef {import('../wrappers/EyesWrappedElement').UniversalSelector} UniversalSelector
 * @typedef {import('../wrappers/EyesWrappedDriver')} EyesWrappedDriver
 */

/**
 * @ignore
 */
class TargetRegionBySelector extends GetSelector {
  /**
   * @param {UniversalSelector} selector
   */
  constructor(selector) {
    super()
    this._selector = selector
  }

  /**
   * @inheritDoc
   * @param {EyesWrappedDriver} driver
   * @return {Promise<string>}
   */
  async getSelector(driver) {
    const randId = GeneralUtils.randomAlphanumeric()
    const elements = await driver.finder.findElements(this._selector)
    if (elements && elements.length > 0) {
      for (let i = 0; i < elements.length; i += 1) {
        await driver.executor.executeScript(
          `arguments[0].setAttribute('${EYES_SELECTOR_TAG}', '${randId}');`,
          elements[i],
        )
      }
    }

    return `[${EYES_SELECTOR_TAG}="${randId}"]`
  }

  async toPersistedRegions(driver) {
    return EyesUtils.locatorToPersistedRegions(driver._logger, driver, this._selector)
  }
}

module.exports = TargetRegionBySelector
