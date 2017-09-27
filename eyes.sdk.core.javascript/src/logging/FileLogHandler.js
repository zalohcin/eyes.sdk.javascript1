'use strict';

const winston = require('winston');

const GeneralUtils = require('../GeneralUtils');
const LogHandler = require('./LogHandler');

/**
 * Write log massages to the browser/node console
 */
class FileLogHandler extends LogHandler {

    /**
     * @param {Boolean} isVerbose Whether to handle or ignore verbose log messages.
     * @param {String} filename The file in which to save the logs.
     **/
    constructor(isVerbose, filename = "eyes.log") {
        super();

        // this._append = append;
        this._filename = filename;
        this.setIsVerbose(isVerbose);
    }

    /**
     * Create a winston file logger
     */
    open() {
        this.close();
        this._logger = new (winston.Logger)({
            exitOnError: false,
            transports: [
                new (winston.transports.File)({
                    filename: this._filename,
                    timestamp: GeneralUtils.getIso8601Data,
                    json: false
                })
            ]
        });
    }

    /**
     * Close the winston file logger
     */
    close() {
        if (this._logger) {
            this._logger.close();
            this._logger = undefined;
        }
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Handle a message to be logged.
     *
     * @param {Boolean} verbose Whether this message is flagged as verbose or not.
     * @param {String} logString The string to log.
     */
    onMessage(verbose, logString) {
        if (this._logger && (!verbose || this._isVerbose)) {
            this._logger.info(`Eyes: ${logString}`);
        }
    }
}

module.exports = FileLogHandler;
