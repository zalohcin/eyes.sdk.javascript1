'use strict';

/**
 * Handles log messages produces by the Eyes API.
 *
 * @interface
 */
class LogHandler {

    constructor() {
        if (new.target === LogHandler) {
            throw new TypeError("Can not construct `LogHandler` instance directly, should be used implementation!");
        }

        this._isVerbose = false;
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Whether to handle or ignore verbose log messages.
     *
     * @param {Boolean} isVerbose
     */
    setIsVerbose(isVerbose) {
        // noinspection PointlessBooleanExpressionJS
        this._isVerbose = !!isVerbose;
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Whether to handle or ignore verbose log messages.
     *
     * @return {Boolean} isVerbose
     */
    getIsVerbose() {
        return this._isVerbose;
    }

    // noinspection JSUnusedGlobalSymbols, JSMethodCanBeStatic
    open() {
        throw new TypeError('The method `open` from `LogHandler` should be implemented!');
    }

    // noinspection JSUnusedGlobalSymbols, JSMethodCanBeStatic
    close() {
        throw new TypeError('The method `close` from `LogHandler` should be implemented!');
    }

    // noinspection JSUnusedGlobalSymbols, JSMethodCanBeStatic, JSUnusedLocalSymbols
    onMessage(verbose, logString) {
        throw new TypeError('The method `onMessage` from `LogHandler` should be implemented!');
    }
}

module.exports = LogHandler;
