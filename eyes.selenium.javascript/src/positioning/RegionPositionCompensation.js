'use strict';

class RegionPositionCompensation {

    constructor() {
        if (new.target === RegionPositionCompensation) {
            throw new TypeError("Can not construct `RegionPositionCompensation` instance directly, should be used implementation!");
        }
    }

    // noinspection JSUnusedGlobalSymbols, JSMethodCanBeStatic
    /**
     * @abstract
     * @param {Region} region
     * @param {number} pixelRatio
     * @return {Region}
     */
    compensateRegionPosition(region, pixelRatio) {
        throw new TypeError('The method `compensateRegionPosition` from `RegionPositionCompensation` should be implemented!');
    }
}

module.exports = RegionPositionCompensation;
