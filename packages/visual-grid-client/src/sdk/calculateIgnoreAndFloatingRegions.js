'use strict';

function calculateIgnoreAndFloatingRegions({
  ignore,
  floating,
  selectorRegions,
  imageLocationRegion,
}) {
  let selectorRegionIndex = imageLocationRegion ? 1 : 0;
  const ignoreRegions = mapIgnoreAndFloatingToRegions(ignore);
  const floatingRegions = mapIgnoreAndFloatingToRegions(floating, true);

  return {
    ignoreRegions,
    floatingRegions,
  };

  function mapIgnoreAndFloatingToRegions(ignoreOrFloating, addOffset) {
    const selectorObjToRegionWithOffset = selectorObjToRegion.bind(null, addOffset);
    return ignoreOrFloating
      ? Array.isArray(ignoreOrFloating)
        ? ignoreOrFloating.map(selectorObjToRegionWithOffset)
        : selectorObjToRegionWithOffset(ignoreOrFloating)
      : ignoreOrFloating;
  }

  function selectorObjToRegion(addOffset, selectorObj) {
    if (selectorObj.selector) {
      const selectorRegion = selectorRegions[selectorRegionIndex++];
      let ret = imageLocationRegion
        ? {
            width: selectorRegion.getWidth(),
            height: selectorRegion.getHeight(),
            left: Math.max(0, selectorRegion.getLeft() - imageLocationRegion.getLeft()),
            top: Math.max(0, selectorRegion.getTop() - imageLocationRegion.getTop()),
          }
        : selectorRegion.toJSON();

      if (addOffset) {
        ret = Object.assign(ret, {
          maxUpOffset: selectorObj.maxUpOffset,
          maxDownOffset: selectorObj.maxDownOffset,
          maxLeftOffset: selectorObj.maxLeftOffset,
          maxRightOffset: selectorObj.maxRightOffset,
        });
      }

      return ret;
    } else {
      return selectorObj;
    }
  }
}

module.exports = calculateIgnoreAndFloatingRegions;
