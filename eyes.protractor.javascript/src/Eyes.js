'use strict';

const {ProtractorBrowser} = require('protractor');
const {EyesError} = require('eyes.sdk');
const {EyesWebDriver} = require('eyes.selenium');
const {ElementFinderWrapper, ElementArrayFinderWrapper} = require('./ElementFinderWrappers');

const VERSION = require('../package.json').version;

/**
 * The main type - to be used by the users of the library to access all functionality.
 */
class Eyes extends require('eyes.selenium').Eyes {

    //noinspection JSUnusedGlobalSymbols,JSMethodCanBeStatic
    getBaseAgentId() {
        return 'eyes.protractor/' + VERSION;
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * @override
     */
    open(driver, appName, testName, viewportSize, sessionType) {
        if (typeof protractor === 'undefined') {
            throw new Error('Protractor component not found.');
        }

        // extend protractor element to return ours
        const originalElementFn = global.element, that = this;
        global.element = (locator) => new ElementFinderWrapper(that._logger, that._driver, originalElementFn(locator));
        global.element.all = (locator) => new ElementArrayFinderWrapper(that._logger, that._driver, originalElementFn.all(locator));

        return super.open(driver, appName, testName, viewportSize, sessionType);
    }

    /** @private */
    _initDriver(driver) {
        if (driver instanceof ProtractorBrowser) {
            this._driver = new EyesWebDriver(this._logger, this, driver);
        } else if (driver instanceof EyesWebDriver) {
            // noinspection JSValidateTypes
            this._driver = driver;
        } else {
            // noinspection JSUnresolvedVariable
            const errMsg = `Driver is not a RemoteWebDriver (${driver.constructor.name})`;
            this._logger.log(errMsg);
            throw new EyesError(errMsg);
        }
    }
}

module.exports = Eyes;
