'use strict'

const {ScrollPositionProvider} = require('./ScrollPositionProvider')
const {EyesTestcafeUtils} = require('../EyesTestcafeUtils')

class OverflowAwareScrollPositionProvider extends ScrollPositionProvider {
  /**
   * @inheritDoc
   */
  async getEntireSize() {
    const result = await EyesTestcafeUtils.getOverflowAwareContentEntireSize(this._executor)
    this._logger.verbose(`OverflowAwareScrollPositionProvider - Entire size: ${result}`)
    return result
  }
}

exports.OverflowAwareScrollPositionProvider = OverflowAwareScrollPositionProvider
