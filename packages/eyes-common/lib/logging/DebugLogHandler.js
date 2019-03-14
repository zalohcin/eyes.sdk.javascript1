'use strict';

const debug = require('debug');
const { LogHandler } = require('./LogHandler');

/**
 * Write log massages to the browser/node console
 */
class DebugLogHandler extends LogHandler {
  /**
   * @param {boolean} [isVerbose=false] - Whether to handle or ignore verbose log messages.
   */
  constructor(isVerbose = false, appName) {
    super(isVerbose);
    this._debug = debug(appName && `eyes:${appName}`);
  }

  /**
   * Handle a message to be logged.
   *
   * @override
   * @param {boolean} verbose - is the message verbose
   * @param {string} logString
   */
  onMessage(verbose, logString) {
    if (!verbose || this.getIsVerbose()) {
      this._debug(logString);
    }
  }
}

exports.DebugLogHandler = DebugLogHandler;
