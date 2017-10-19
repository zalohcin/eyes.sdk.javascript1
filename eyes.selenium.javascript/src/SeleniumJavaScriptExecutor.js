'use strict';

const {EyesJsExecutor} = require('eyes.sdk');

class SeleniumJavaScriptExecutor extends EyesJsExecutor {

    /**
     * @param {EyesWebDriver} driver
     */
    constructor(driver) {
        super();

        this._driver = driver;
    }

    /**
     * @override
     * @inheritDoc
     */
    executeScript(script, ...args) {
        return this._driver.executeScript(script, args);
    }
}

module.exports = SeleniumJavaScriptExecutor;
