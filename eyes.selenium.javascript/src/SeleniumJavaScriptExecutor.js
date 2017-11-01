'use strict';

const {EyesJsExecutor} = require('eyes.sdk');

class SeleniumJavaScriptExecutor extends EyesJsExecutor {

    /**
     * @param {EyesWebDriver|WebDriver} driver
     */
    constructor(driver) {
        super();

        this._executor = driver;
    }

    /**
     * @override
     * @inheritDoc
     */
    executeScript(script, ...args) {
        return this._executor.executeScript(script, args);
    }

    /**
     * @override
     * @inheritDoc
     */
    sleep(millis) {
        return this._executor.sleep(millis);
    }
}

module.exports = SeleniumJavaScriptExecutor;
