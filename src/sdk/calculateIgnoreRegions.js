'use strict';

function calculateIgnoreRegions({ignore, selectorRegions, imageLocationRegion}) {
  let selectorRegionIndex = imageLocationRegion ? 1 : 0;
  return ignore
    ? ignore.map(region => {
        if (region.selector) {
          const selectorRegion = selectorRegions[selectorRegionIndex++];
          return imageLocationRegion
            ? {
                width: selectorRegion.getWidth(),
                height: selectorRegion.getHeight(),
                left: Math.max(0, selectorRegion.getLeft() - imageLocationRegion.getLeft()),
                top: Math.max(0, selectorRegion.getTop() - imageLocationRegion.getTop()),
              }
            : selectorRegion.toJSON();
        } else {
          return region;
        }
      })
    : ignore;
}

module.exports = calculateIgnoreRegions;
