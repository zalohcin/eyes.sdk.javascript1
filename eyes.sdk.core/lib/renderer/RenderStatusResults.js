'use strict';

const { GeneralUtils } = require('../utils/GeneralUtils');

/**
 * Encapsulates data for the render currently running in the client.
 */
class RenderStatusResults {
  constructor() {
    this._status = null;
    this._imageLocation = null;
    this._error = null;
  }

  /**
   * @param {object} object
   * @return {RenderStatusResults}
   */
  static fromObject(object) {
    return GeneralUtils.assignTo(new RenderStatusResults(), object);
  }

  /** @return {RenderStatus} */
  getStatus() {
    return this._status;
  }

  // noinspection JSUnusedGlobalSymbols
  /** @param {string} value */
  setStatus(value) {
    this._status = value;
  }

  /** @return {string} */
  getImageLocation() {
    return this._imageLocation;
  }

  // noinspection JSUnusedGlobalSymbols
  /** @param {string} value */
  setImageLocation(value) {
    this._imageLocation = value;
  }

  /** @return {string} */
  getError() {
    return this._error;
  }

  // noinspection JSUnusedGlobalSymbols
  /** @param {string} value */
  setError(value) {
    this._error = value;
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
