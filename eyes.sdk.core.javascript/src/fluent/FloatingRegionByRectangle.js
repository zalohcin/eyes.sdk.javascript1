'use strict';

const FloatingMatchSettings = require('../positioning/FloatingMatchSettings');

class FloatingRegionByRectangle {

    /**
     * @param {Region} rect
     * @param {int} maxUpOffset
     * @param {int} maxDownOffset
     * @param {int} maxLeftOffset
     * @param {int} maxRightOffset
     */
    constructor(rect, maxUpOffset, maxDownOffset, maxLeftOffset, maxRightOffset) {
        this._rect = rect;
        this._maxUpOffset = maxUpOffset;
        this._maxDownOffset = maxDownOffset;
        this._maxLeftOffset = maxLeftOffset;
        this._maxRightOffset = maxRightOffset;
    }

    /**
     *
     * @return {FloatingMatchSettings}
     */
    getRegion() {
        return new FloatingMatchSettings(
            this._rect.getLeft(), this._rect.getTop(),
            this._rect.getWidth(), this._rect.getHeight(),
            this._maxUpOffset, this._maxDownOffset,
            this._maxLeftOffset, this._maxRightOffset
        );
    }
}

module.exports = FloatingRegionByRectangle;
