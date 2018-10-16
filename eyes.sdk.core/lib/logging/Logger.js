'use strict';

const { GeneralUtils } = require('../utils/GeneralUtils');
const { NullLogHandler } = require('./NullLogHandler');

/**
 * Write log massages using the provided Log Handler
 */
class Logger {
  constructor() {
    this._logHandler = new NullLogHandler(); // Default.
    this._sessionId = '';
  }

  /**
   * @param {string} sessionId
   */
  setSessionId(sessionId) {
    this._sessionId = sessionId;
  }

  /**
   * @return {LogHandler} The currently set log handler.
   */
  getLogHandler() {
    return this._logHandler;
  }

  /**
   * @param {LogHandler} [handler] The log handler to set. If you want a log handler which does nothing, use
   *   {@link NullLogHandler}.
   */
  setLogHandler(handler) {
    this._logHandler = handler || new NullLogHandler();
  }

  /**
   * Writes a verbose write message.
   *
   * @param {*} args
   */
  verbose(...args) {
    this._logHandler.onMessage(true, `[VERBOSE] ${this._getPrefix()}${GeneralUtils.stringify(...args)}`);
  }

  /**
   * Writes a (non-verbose) write message.
   *
   * @param {*} args
   */
  log(...args) {
    this._logHandler.onMessage(false, `[LOG    ] ${this._getPrefix()}${GeneralUtils.stringify(...args)}`);
  }

  // noinspection JSMethodCanBeStatic
  /**
   * @private
   * @return {string} The name of the method which called the logger, if possible, or an empty string.
   */
  _getPrefix() {
    const trace = GeneralUtils.getStackTrace();

    let prefix = `{${this._sessionId}} `;
    // getStackTrace() <- _getPrefix() <- log()/verbose() <- "actual caller"
    if (trace && trace.length >= 3) {
      const className = trace[3].getTypeName();
      const methodName = trace[3].getMethodName();

      if (className && methodName) {
        prefix += `${className}.${methodName}(): `;
      } else {
        prefix += '(): ';
      }
    }

    return prefix;
  }
}

exports.Logger = Logger;
