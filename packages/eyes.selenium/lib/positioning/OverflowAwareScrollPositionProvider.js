'use strict';

const { ScrollPositionProvider } = require('./ScrollPositionProvider');
const { EyesSeleniumUtils } = require('../EyesSeleniumUtils');

class OverflowAwareScrollPositionProvider extends ScrollPositionProvider {
  /** @inheritDoc */
  getEntireSize() {
    const that = this;
    return EyesSeleniumUtils.getOverflowAwareContentEntireSize(this._executor).then(result => {
      that._logger.verbose(`OverflowAwareScrollPositionProvider - Entire size: ${result}`);
      return result;
    });
  }
}

exports.OverflowAwareScrollPositionProvider = OverflowAwareScrollPositionProvider;
