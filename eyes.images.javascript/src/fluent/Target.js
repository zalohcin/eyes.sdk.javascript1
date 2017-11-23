'use strict';

const {MutableImage, GeneralUtils, ArgumentGuard} = require('eyes.sdk');

const ImagesCheckSettings = require('./ImagesCheckSettings');

class Target {

    /**
     * @param {String|Buffer|MutableImage} image
     * @return {ImagesCheckSettings}
     */
    static image(image) {
        if (image instanceof MutableImage) {
            return new ImagesCheckSettings(image);
        } else if (GeneralUtils.isBuffer(image)) {
            return new ImagesCheckSettings(undefined, image);
        } else if (GeneralUtils.isString(image)) {
            return new ImagesCheckSettings(undefined, undefined, image);
        }

        throw new TypeError(`IllegalType: unsupported type of image!`);
    }

    /**
     * @param {Buffer} buffer
     * @return {ImagesCheckSettings}
     */
    static buffer(buffer) {
        ArgumentGuard.isBuffer(buffer);

        return new ImagesCheckSettings(undefined, buffer);
    }

    /**
     * @param {String} string
     * @return {ImagesCheckSettings}
     */
    static base64(string) {
        ArgumentGuard.isBuffer(string);

        return new ImagesCheckSettings(undefined, undefined, string);
    }

    /**
     * @param {String|Buffer|MutableImage} image
     * @param {Region|RegionObject} rect
     * @return {ImagesCheckSettings}
     */
    static region(image, rect) {
        const checkSettings = Target.image(image);
        // noinspection JSAccessibilityCheck
        checkSettings.region(rect);
        return checkSettings;
    }
}

module.exports = Target;
