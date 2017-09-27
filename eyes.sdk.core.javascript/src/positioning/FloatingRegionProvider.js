'use strict';

/**
 * Encapsulates a getRegion "callback" and how the region's coordinates should be used.
 *
 * @interface
 */
class FloatingRegionProvider {

    constructor() {
        if (new.target === FloatingRegionProvider) {
            throw new TypeError("Can not construct `FloatingRegionProvider` instance directly, should be used implementation!");
        }
    }

    // noinspection JSMethodCanBeStatic
    /**
     * @abstract
     * @return {FloatingMatchSettings} A region with "as is" viewport coordinates.
     */
    getRegion() {
        throw new TypeError('The method `getRegion` from `FloatingRegionProvider` should be implemented!');
    }
}

module.exports = FloatingRegionProvider;
