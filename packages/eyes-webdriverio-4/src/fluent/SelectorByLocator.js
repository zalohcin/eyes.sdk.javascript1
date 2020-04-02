'use strict'

const {GeneralUtils, GetSelector} = require('@applitools/eyes-sdk-core')

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
  async getSelector(eyes) {
    const randId = GeneralUtils.randomAlphanumeric()
    const elements = await eyes._driver.elements(this._selector)
    if (elements && elements.length > 0) {
      for (let i = 0; i < elements.length; i += 1) {
        await eyes._driver.execute(
          `arguments[0].setAttribute('${EYES_SELECTOR_TAG}', '${randId}');`,
          elements[i],
        )
      }
    }

    return `[${EYES_SELECTOR_TAG}="${randId}"]`
  }
}

exports.SelectorByLocator = SelectorByLocator
