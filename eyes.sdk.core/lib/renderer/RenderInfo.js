'use strict';

const { GeneralUtils } = require('../utils/GeneralUtils');

class RenderInfo {
  constructor() {
    this._width = undefined;
    this._height = undefined;
    this._sizeMode = undefined;
  }

  /**
   * @param {Object} object
   * @return {RenderInfo}
   */
  static fromObject(object) {
    return GeneralUtils.assignTo(new RenderInfo(), object);
  }

  /**
   * @param {RectangleSize} size
   * @param {string} [sizeMode='full-page'] supported values [viewport|full-page]
   * @return {RenderInfo}
   */
  static fromRectangleSize(size, sizeMode = 'full-page') {
    const renderInfo = new RenderInfo();
    renderInfo.setWidth(size.getWidth());
    renderInfo.setHeight(size.getHeight());
    renderInfo.setSizeMode(sizeMode);
    return renderInfo;
  }

  /** @return {number} */
  getWidth() {
    return this._width;
  }

  /** @param {number} value */
  setWidth(value) {
    this._width = value;
  }

  /** @return {number} */
  getHeight() {
    return this._height;
  }

  /** @param {number} value */
  setHeight(value) {
    this._height = value;
  }

  /** @return {string} */
  getSizeMode() {
    return this._sizeMode;
  }

  /** @param {string} value */
  setSizeMode(value) {
    this._sizeMode = value;
  }

  /** @override */
  toJSON() {
    return GeneralUtils.toPlain(this);
  }

  /** @override */
  toString() {
    return `RenderInfo { ${JSON.stringify(this)} }`;
  }
}

exports.RenderInfo = RenderInfo;
