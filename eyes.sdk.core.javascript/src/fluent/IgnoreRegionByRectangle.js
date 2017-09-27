'use strict';

class IgnoreRegionByRectangle {

    /**
     * @param {Region} region
     */
    constructor(region) {
        this._region = region;
    }

    /**
     * @return {Region}
     */
    getRegion() {
        return this._region;
    }
}

module.exports = IgnoreRegionByRectangle;
