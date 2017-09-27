'use strict';

/**
 * Encapsulates a getRegion "callback" and how the region's coordinates should be used.
 *
 * @interface
 */
class RegionProvider {

    constructor() {
        if (new.target === RegionProvider) {
            throw new TypeError("Can not construct `RegionProvider` instance directly, should be used implementation!");
        }
    }

    // noinspection JSMethodCanBeStatic
    /**
     * @abstract
     * @return {Region} A region with "as is" viewport coordinates.
     */
    getRegion() {
        throw new TypeError('The method `getRegion` from `RegionProvider` should be implemented!');
    }
}

module.exports = RegionProvider;
