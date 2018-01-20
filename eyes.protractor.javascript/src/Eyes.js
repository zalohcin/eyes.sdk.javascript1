'use strict';

const {ElementFinderWrapper, ElementArrayFinderWrapper} = require('./ElementFinderWrappers');

const VERSION = require('../package.json').version;

/**
 * The main type - to be used by the users of the library to access all functionality.
 */
class Eyes extends require('eyes.selenium').Eyes {

    /** @override */
    getBaseAgentId() {
        return 'eyes.protractor/' + VERSION;
    }

    /** @override */
    open(driver, appName, testName, viewportSize, sessionType) {
        if (typeof protractor === 'undefined') {
            throw new Error('Protractor component not found.');
        }

        // extend protractor element to return ours
        if (!global.isEyesOverrodeProtractor) {
            const originalElementFn = global.element, that = this;
            global.element = (locator) => new ElementFinderWrapper(that._logger, that._driver, originalElementFn(locator));
            global.element.all = (locator) => new ElementArrayFinderWrapper(that._logger, that._driver, originalElementFn.all(locator));
            global.isEyesOverrodeProtractor = true;
        }

        return super.open(driver, appName, testName, viewportSize, sessionType);
    }
}

module.exports = Eyes;
