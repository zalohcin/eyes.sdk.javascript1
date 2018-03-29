'use strict';

const { RegionPositionCompensation } = require('./RegionPositionCompensation');

class NullRegionPositionCompensation extends RegionPositionCompensation {
  /**
   * @override
   * @inheritDoc
   */
  compensateRegionPosition(region, pixelRatio) {
    return region;
  }
}

exports.NullRegionPositionCompensation = NullRegionPositionCompensation;
