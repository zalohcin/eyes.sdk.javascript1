'use strict';

const { CssTranslatePositionProvider } = require('./CssTranslatePositionProvider');
const { EyesSeleniumUtils } = require('../EyesSeleniumUtils');

class OverflowAwareCssTranslatePositionProvider extends CssTranslatePositionProvider {
  /** @inheritDoc */
  getEntireSize() {
    const that = this;
    return EyesSeleniumUtils.getOverflowAwareContentEntireSize(this._executor).then(result => {
      that._logger.verbose(`OverflowAwareCssTranslatePositionProvider - Entire size: ${result}`);
      return result;
    });
  }
}

exports.OverflowAwareCssTranslatePositionProvider = OverflowAwareCssTranslatePositionProvider;
