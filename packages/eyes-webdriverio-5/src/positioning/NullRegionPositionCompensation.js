'use strict'

const RegionPositionCompensation = require('./RegionPositionCompensation')

class NullRegionPositionCompensation extends RegionPositionCompensation {
  /**
   * @override
   * @inheritDoc
   */
  // eslint-disable-next-line
  compensateRegionPosition(region, pixelRatio) {
    return region
  }
}

module.exports = NullRegionPositionCompensation
