'use strict';

const GetRegion = require('./GetRegion');

class IgnoreRegionByRectangle extends GetRegion {

    /**
     * @param {Region} region
     */
    constructor(region) {
        super();
        this._region = region;
    }

    /**
     * @override
     */
    getRegion(eyesBase) {
        return eyesBase.getPromiseFactory().resolve(this._region);
    }
}

module.exports = IgnoreRegionByRectangle;
