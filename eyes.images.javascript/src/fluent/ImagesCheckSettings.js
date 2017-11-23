'use strict';

const {CheckSettings} = require('eyes.sdk');

class ImagesCheckSettings extends CheckSettings {

    /**
     * @param {MutableImage} [image]
     * @param {Buffer} [buffer]
     * @param {String} [string]
     */
    constructor(image, buffer, string) {
        super();

        this._image = image;
        this._buffer = buffer;
        this._string = string;

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
        return this._string;
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
