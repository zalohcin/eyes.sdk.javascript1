'use strict';

const stackTrace = require('stack-trace');

const { ArgumentGuard } = require('../utils/ArgumentGuard');
const { GeneralUtils } = require('../utils/GeneralUtils');
const { TypeUtils } = require('../utils/TypeUtils');
const { DateTimeUtils } = require('../utils/DateTimeUtils');

const { ConsoleLogHandler } = require('./ConsoleLogHandler');
const { NullLogHandler } = require('./NullLogHandler');

/**
 * Write log massages using the provided Log Handler
 */
class Logger {
  /**
   * @param {boolean|string} [showLogs] - Determines which log handler will be used ConsoleLogHandler (if set to {@code true})
   *   or NullLogHandler (if not set or set to {@code false})
   */
  constructor(showLogs = false) {
    if (TypeUtils.isString(showLogs)) {
      showLogs = (showLogs === 'true');
    }

    ArgumentGuard.isBoolean(showLogs, 'showLogs', false);

    this._logHandler = showLogs ? new ConsoleLogHandler(true) : new NullLogHandler();
    this._sessionId = '';
  }

  /**
   * @param {string} sessionId
   */
  setSessionId(sessionId) {
    this._sessionId = sessionId;
  }

  /**
   * @return {LogHandler} - The currently set log handler.
   */
  getLogHandler() {
    return this._logHandler;
  }

  /**
   * @param {LogHandler} [handler] - The log handler to set. If you want a log handler which does nothing, use
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
    this._logHandler.onMessage(true, this._getFormattedString('VERBOSE', GeneralUtils.stringify(...args)));
  }

  /**
   * Writes a (non-verbose) write message.
   *
   * @param {*} args
   */
  log(...args) {
    this._logHandler.onMessage(false, this._getFormattedString('LOG    ', GeneralUtils.stringify(...args)));
  }

  // noinspection JSMethodCanBeStatic
  /**
   * @private
   * @return {string} - The name of the method which called the logger, if possible, or an empty string.
   */
  _getFormattedString(logLevel, message) {
    return `${DateTimeUtils.toISO8601DateTime()} Eyes: [${logLevel}] {${this._sessionId}} ${this._getMethodName()}${message}`;
  }

  // noinspection JSMethodCanBeStatic
  /**
   * @private
   * @return {string} - The name of the method which called the logger, if possible, or an empty string.
   */
  _getMethodName() {
    if (typeof Error.captureStackTrace == 'function') {
      /**
       * @typedef {object} CallSite
       * @property {function(): string} getTypeName returns the type of this as a string.
       * @property {function(): string} getFunctionName returns the name of the current function, typically its name property.
       * @property {function(): string} getMethodName returns the name of the property of this or one of its prototypes that holds the current function
       * @property {function(): string} getFileName if this function was defined in a script returns the name of the script
       * @property {function(): number} getLineNumber if this function was defined in a script returns the current line number
       * @property {function(): number} getColumnNumber if this function was defined in a script returns the current column number
       * @property {function(): boolean} isNative is this call in native V8 code?
       */
      /** @type {CallSite[]} */
      const trace = stackTrace.get();

      // _getMethodName() <- _getFormattedString <- log()/verbose() <- "actual caller"
      if (trace && trace.length >= 3) {
        const className = trace[3].getTypeName();
        const methodName = trace[3].getMethodName();

        if (className) {
          return `${className}.${(methodName || '<init>')}(): `;
        } else {
          return '(): ';
        }
      }
    }

    return '';
  }
}

exports.Logger = Logger;
