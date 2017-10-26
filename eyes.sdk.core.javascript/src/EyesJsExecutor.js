'use strict';

/**
 * @interface
 */
class EyesJsExecutor {

    constructor() {
        if (new.target === EyesJsExecutor) {
            throw new TypeError("Can not construct `EyesJsExecutor` instance directly, should be used implementation!");
        }
    }

    // noinspection JSMethodCanBeStatic
    /**
     * @abstract
     * @param {String} script
     * @param {Object...} args
     * @return {Promise.<any>}
     */
    executeScript(script, ...args) {
        throw new TypeError('The method `executeScript` from `EyesJsExecutor` should be implemented!');
    }

    // noinspection JSMethodCanBeStatic
    /**
     * @abstract
     * @param {int} millis
     * @return {Promise.<void>}
     */
    sleep(millis) {
        throw new TypeError('The method `sleep` from `EyesJsExecutor` should be implemented!');
    }
}

module.exports = EyesJsExecutor;
