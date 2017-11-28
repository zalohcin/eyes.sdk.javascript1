'use strict';

const {EyesJsExecutor, ArgumentGuard} = require('eyes.sdk');

class SeleniumJavaScriptExecutor extends EyesJsExecutor {

    /**
     * @param {EyesWebDriver|WebDriver} driver
     * @param {PromiseFactory} [promiseFactory]
     */
    constructor(driver, promiseFactory) {
        super();

        if (!driver.hasOwnProperty('getPromiseFactory')) {
            ArgumentGuard.notNull(promiseFactory, 'promiseFactory')
        }

        this._executor = driver;
        this._promiseFactory = promiseFactory || driver.getPromiseFactory();
    }

    /** @override */
    executeScript(script, ...args) {
        return this._executor.executeScript(script, args);
    }

    /** @override */
    sleep(millis) {
        return this._executor.sleep(millis);
    }

    /** @override */
    getPromiseFactory() {
        return this._promiseFactory;
    }
}

module.exports = SeleniumJavaScriptExecutor;
