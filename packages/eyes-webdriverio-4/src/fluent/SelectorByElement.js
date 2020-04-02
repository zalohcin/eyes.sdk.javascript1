'use strict'

const {GeneralUtils} = require('@applitools/eyes-common')
const {GetSelector} = require('@applitools/eyes-sdk-core')

const EYES_SELECTOR_TAG = 'data-eyes-selector'

/**
 * @ignore
 */
class SelectorByElement extends GetSelector {
  /**
   * @param {EyesWebElement} webElement
   */
  constructor(webElement) {
    super()
    this._element = webElement
  }

  /**
   * @inheritDoc
   * @param {Eyes} eyes
   * @return {Promise<string>}
   */
  async getSelector(eyes) {
    const randId = GeneralUtils.randomAlphanumeric()
    await eyes._driver.execute(
      `arguments[0].setAttribute('${EYES_SELECTOR_TAG}', '${randId}');`,
      this._element,
    )
    return `[${EYES_SELECTOR_TAG}="${randId}"]`
  }
}

exports.SelectorByElement = SelectorByElement
