'use strict';

/**
 * Encapsulates the instantiation of an EyesScreenshot object.
 *
 * @interface
 */
class EyesScreenshotFactory {

    constructor() {
        if (new.target === EyesScreenshotFactory) {
            throw new TypeError("Can not construct `EyesScreenshotFactory` instance directly, should be used implementation!");
        }
    }

    // noinspection JSMethodCanBeStatic, JSUnusedGlobalSymbols
    /**
     * @abstract
     * @param {MutableImage} image
     * @return {Promise.<EyesScreenshot>}
     */
    makeScreenshot(image) {
        throw new TypeError('The method `makeScreenshot` from `EyesScreenshotFactory` should be implemented!');
    }
}

module.exports = EyesScreenshotFactory;
