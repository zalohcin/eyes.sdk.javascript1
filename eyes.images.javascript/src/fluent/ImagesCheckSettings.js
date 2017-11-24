'use strict';

const {CheckSettings} = require('eyes.sdk');

class ImagesCheckSettings extends CheckSettings {

    /**
     * @param {MutableImage} [image]
     * @param {Buffer} [buffer]
     * @param {String} [base64]
     * @param {String} [path]
     */
    constructor(image, buffer, base64, path) {
        super();

        this._image = image;
        this._buffer = buffer;
        this._base64 = base64;
        this._path = path;

        this._targetRegion = undefined;
    }

    /**
     * @return {MutableImage}
     */
    getMutableImage() {
        return this._image;
    }

    /**
     * @return {Buffer}
     */
    getImageBuffer() {
        return this._buffer;
    }

    /**
     * @return {String}
     */
    getImageString() {
        return this._base64;
    }

    /**
     * @return {String}
     */
    getImagePath() {
        return this._path;
    }

    /**
     * @param {Region|RegionObject} region The region to validate.
     * @return {ImagesCheckSettings}
     */
    region(region) {
        super.updateTargetRegion(region);
        return this;
    }
}

module.exports = ImagesCheckSettings;
