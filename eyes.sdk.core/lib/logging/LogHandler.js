'use strict';

/**
 * Handles log messages produces by the Eyes API.
 *
 * @abstract
 */
class LogHandler {
  constructor() {
    this._isVerbose = false;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Whether to handle or ignore verbose log messages.
   *
   * @param {boolean} isVerbose
   */
  setIsVerbose(isVerbose) {
    // noinspection PointlessBooleanExpressionJS
    this._isVerbose = !!isVerbose;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Whether to handle or ignore verbose log messages.
   *
   * @return {boolean} isVerbose
   */
  getIsVerbose() {
    return this._isVerbose;
  }

  /**
   * @abstract
   */
  open() {}

  /**
   * @abstract
   */
  close() {}

  /**
   * @abstract
   * @param {boolean} verbose
   * @param {string} logString
   */
  onMessage(verbose, logString) {}
}

exports.LogHandler = LogHandler;
