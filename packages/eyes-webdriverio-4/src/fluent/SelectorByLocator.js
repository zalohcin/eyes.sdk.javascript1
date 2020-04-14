'use strict'

const {GeneralUtils, GetSelector, EyesUtils} = require('@applitools/eyes-sdk-core')

const EYES_SELECTOR_TAG = 'data-eyes-selector'

/**
 * @ignore
 */
class SelectorByLocator extends GetSelector {
  /**
   * @param {By} regionLocator
   */
  constructor(regionLocator) {
    super()
    this._selector = regionLocator
  }

  /**
   * @inheritDoc
   * @param {Eyes} eyes
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

exports.SelectorByLocator = SelectorByLocator
