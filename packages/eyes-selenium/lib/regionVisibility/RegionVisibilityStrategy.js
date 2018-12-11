'use strict';

/**
 * @interface
 */
class RegionVisibilityStrategy {
  /**
   * @param {PositionProvider} positionProvider
   * @param {Location} location
   * @return {Promise<void>}
   */
  moveToRegion(positionProvider, location) {}

  /**
   * @param {PositionProvider} positionProvider
   * @return {Promise<void>}
   */
  returnToOriginalPosition(positionProvider) {}
}

exports.RegionVisibilityStrategy = RegionVisibilityStrategy;
