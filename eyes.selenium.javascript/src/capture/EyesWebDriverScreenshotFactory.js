'use strict';

const {EyesScreenshotFactory} = require('eyes.sdk');

const EyesWebDriverScreenshot = require('./EyesWebDriverScreenshot');

/**
 * Encapsulates the instantiation of an {@link EyesWebDriverScreenshot} .
 */
class EyesWebDriverScreenshotFactory extends EyesScreenshotFactory {

    /**
     * @param {Object} logger
     * @param {EyesWebDriver} driver
     * @param {PromiseFactory} promiseFactory
     */
    constructor(logger, driver, promiseFactory) {
        super();

        this._logger = logger;
        this._driver = driver;
        this._promiseFactory = promiseFactory;
    }

    /**
     * @override
     * @inheritDoc
     */
    makeScreenshot(image) {
        const result = new EyesWebDriverScreenshot(this._logger, this._driver, this._image, this._promiseFactory);
        return result.init();
    }
}

module.exports = EyesWebDriverScreenshotFactory;
