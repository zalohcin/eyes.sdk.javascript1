'use strict';

/**
 * @interface
 */
class RegionVisibilityStrategy {

    /**
     * @param {PositionProvider} positionProvider
     * @param {Location} location
     * @return {Promise}
     */
    moveToRegion(positionProvider, location) {}

    /**
     * @param {PositionProvider} positionProvider
     * @return {Promise}
     */
    returnToOriginalPosition(positionProvider) {}
}

module.exports = RegionVisibilityStrategy;
