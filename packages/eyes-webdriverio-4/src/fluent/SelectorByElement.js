'use strict'

const {GetSelector, GeneralUtils, EyesJsBrowserUtils} = require('@applitools/eyes-sdk-core')
const WDIOElement = require('../wrappers/WDIOElement')

const EYES_SELECTOR_TAG = 'data-eyes-selector'

/**
 * @ignore
 */
class SelectorByElement extends GetSelector {
  /**
   * @param {WDIOElement|object} element
   */
  constructor(element) {
    super()
    this._element = element
  }

  /**
   * @inheritDoc
   * @param {Eyes} eyes
   * @return {Promise<string>}
   */
  async getSelector(driver) {
    this._element = new WDIOElement(driver._logger, driver, this.element)
    const randId = GeneralUtils.randomAlphanumeric()
    await driver.executor.executeScript(
      `arguments[0].setAttribute('${EYES_SELECTOR_TAG}', '${randId}');`,
      this._element,
    )
    return `[${EYES_SELECTOR_TAG}="${randId}"]`
  }

  async toPersistedRegions(driver) {
    const xpath = await EyesJsBrowserUtils.getElementXpath(driver.executor, this._element)
    return [{type: 'xpath', selector: xpath}]
  }
}

exports.SelectorByElement = SelectorByElement
