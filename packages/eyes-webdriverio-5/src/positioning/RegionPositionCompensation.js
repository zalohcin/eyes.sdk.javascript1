'use strict'

/**
 * @interface
 */
class RegionPositionCompensation {
  /**
   * @param {Region} region
   * @param {number} pixelRatio
   * @return {Region}
   */
  // eslint-disable-next-line
  compensateRegionPosition(region, pixelRatio) {}
}

module.exports = RegionPositionCompensation
