'use strict';

const { GeneralUtils } = require('../utils/GeneralUtils');

/**
 * Encapsulates data for the render currently running in the client.
 */
class RenderStatusResults {
  constructor() {
    this._status = undefined;
    this._imageLocation = undefined;
    this._error = undefined;
    this._os = undefined;
    this._userAgent = undefined;
    this._width = undefined;
    this._height = undefined;
  }

  /**
   * @param {object} object
   * @return {RenderStatusResults}
   */
  static fromObject(object) {
    return GeneralUtils.assignTo(new RenderStatusResults(), object);
  }

  /** @return {boolean} */
  isEmpty() {
    return (
      this._status === undefined &&
      this._imageLocation === undefined &&
      this._error === undefined &&
      this._os === undefined &&
      this._userAgent === undefined
    );
  }

  /** @return {RenderStatus} */
  getStatus() {
    return this._status;
  }

  /** @param {string} value */
  setStatus(value) {
    this._status = value;
  }

  /** @return {string} */
  getImageLocation() {
    return this._imageLocation;
  }

  /** @param {string} value */
  setImageLocation(value) {
    this._imageLocation = value;
  }

  /** @return {string} */
  getError() {
    return this._error;
  }

  /** @param {string} value */
  setError(value) {
    this._error = value;
  }

  /** @return {string} */
  getOS() {
    return this._os;
  }

  /** @param {string} value */
  setOS(value) {
    this._os = value;
  }

  /** @return {string} */
  getUserAgent() {
    return this._userAgent;
  }

  /** @param {string} value */
  setUserAgent(value) {
    this._userAgent = value;
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

  /** @override */
  toJSON() {
    return GeneralUtils.toPlain(this);
  }

  /** @override */
  toString() {
    return `RenderStatusResults { ${JSON.stringify(this)} }`;
  }
}

exports.RenderStatusResults = RenderStatusResults;
