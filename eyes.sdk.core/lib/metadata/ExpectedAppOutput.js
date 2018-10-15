'use strict';

const { GeneralUtils } = require('../utils/GeneralUtils');
const { Annotations } = require('./Annotations');
const { Image } = require('./Image');

class ExpectedAppOutput {
  constructor() {
    this._tag = undefined;
    this._image = undefined;
    this._thumbprint = undefined;
    this._occurredAt = undefined;
    this._annotations = undefined;
  }

  /**
   * @param {object} object
   * @return {ExpectedAppOutput}
   */
  static fromObject(object) {
    return GeneralUtils.assignTo(new ExpectedAppOutput(), object, {
      image: Image.fromObject,
      thumbprint: Image.fromObject,
      // _occurredAt: Image.fromObject,
      annotations: Annotations.fromObject,
    });
  }

  // noinspection JSUnusedGlobalSymbols
  /** @return {string} */
  getTag() {
    return this._tag;
  }

  // noinspection JSUnusedGlobalSymbols
  /** @param {string} value */
  setTag(value) {
    this._tag = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /** @return {Image} */
  getImage() {
    return this._image;
  }

  // noinspection JSUnusedGlobalSymbols
  /** @param {Image} value */
  setImage(value) {
    this._image = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /** @return {Image} */
  getThumbprint() {
    return this._thumbprint;
  }

  // noinspection JSUnusedGlobalSymbols
  /** @param {Image} value */
  setThumbprint(value) {
    this._thumbprint = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /** @return {Date} */
  getOccurredAt() {
    return this._occurredAt;
  }

  // noinspection JSUnusedGlobalSymbols
  /** @param {Date} value */
  setOccurredAt(value) {
    this._occurredAt = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /** @return {Annotations} */
  getAnnotations() {
    return this._annotations;
  }

  // noinspection JSUnusedGlobalSymbols
  /** @param {Annotations} value */
  setAnnotations(value) {
    this._annotations = value;
  }

  /** @override */
  toJSON() {
    return GeneralUtils.toPlain(this);
  }

  /** @override */
  toString() {
    return `ExpectedAppOutput { ${JSON.stringify(this)} }`;
  }
}

exports.ExpectedAppOutput = ExpectedAppOutput;
