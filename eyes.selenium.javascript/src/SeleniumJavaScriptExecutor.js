'use strict';

const {EyesJsExecutor, ArgumentGuard} = require('eyes.sdk.core');

class SeleniumJavaScriptExecutor extends EyesJsExecutor {

    /**
     * @param {EyesWebDriver|WebDriver} driver
     * @param {PromiseFactory} [promiseFactory]
     */
    constructor(driver, promiseFactory) {
        super();

        if (!driver.getPromiseFactory) {
            ArgumentGuard.notNull(promiseFactory, 'promiseFactory')
        }

        this._driver = driver;
        this._promiseFactory = promiseFactory || driver.getPromiseFactory();
    }

    /** @override */
    executeScript(script, ...args) {
        return this._driver.executeScript(script, args);
    }

    /** @override */
    sleep(millis) {
        return this._driver.sleep(millis);
    }

    /** @override */
    getPromiseFactory() {
        return this._promiseFactory;
    }
}

module.exports = SeleniumJavaScriptExecutor;
