'use strict'

const {CssTranslatePositionProvider} = require('./CssTranslatePositionProvider')
const {EyesTestcafeUtils} = require('../EyesTestcafeUtils')

class OverflowAwareCssTranslatePositionProvider extends CssTranslatePositionProvider {
  /**
   * @inheritDoc
   */
  async getEntireSize() {
    const result = await EyesTestcafeUtils.getOverflowAwareContentEntireSize(this._executor)
    this._logger.verbose(`OverflowAwareCssTranslatePositionProvider - Entire size: ${result}`)
    return result
  }
}

exports.OverflowAwareCssTranslatePositionProvider = OverflowAwareCssTranslatePositionProvider
