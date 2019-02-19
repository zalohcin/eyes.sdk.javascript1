'use strict';

const {
  CheckSettings,
  Region,
  IgnoreRegionByRectangle,
  FloatingRegionByRectangle,
} = require('@applitools/eyes-sdk-core');

function createCheckSettings({ignore, floating, layout, strict}) {
  const checkSettings = new CheckSettings(0);
  setEachRegion(ignore, checkSettings.ignoreRegions.bind(checkSettings));
  setEachRegion(layout, checkSettings.layoutRegions.bind(checkSettings));
  setEachRegion(strict, checkSettings.strictRegions.bind(checkSettings));

  if (floating) {
    floating = [].concat(floating);
    for (const region of floating) {
      if (region instanceof FloatingRegionByRectangle) {
        checkSettings.floatingRegion(region);
      } else {
        checkSettings.floatingRegion(
          new Region(region),
          region.maxUpOffset,
          region.maxDownOffset,
          region.maxLeftOffset,
          region.maxRightOffset,
        );
      }
    }
  }

  return checkSettings;

  function setEachRegion(regions, addToSettings) {
    if (regions) {
      regions = [].concat(regions);
      for (const region of regions) {
        if (region instanceof IgnoreRegionByRectangle) {
          addToSettings(region);
        } else {
          addToSettings(new Region(region));
        }
      }
    }
  }
}

module.exports = createCheckSettings;
