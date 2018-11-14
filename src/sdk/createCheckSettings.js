'use strict';
const {CheckSettings, Region} = require('@applitools/eyes-sdk-core');

function createCheckSettings({ignore, floating}) {
  const checkSettings = new CheckSettings(0);
  if (ignore) {
    ignore = [].concat(ignore);
    for (const region of ignore) {
      checkSettings.ignoreRegions(new Region(region));
    }
  }
  if (floating) {
    floating = [].concat(floating);
    for (const region of floating) {
      checkSettings.floatingRegion(
        new Region(region),
        region.maxUpOffset,
        region.maxDownOffset,
        region.maxLeftOffset,
        region.maxRightOffset,
      );
    }
  }
  return checkSettings;
}

module.exports = createCheckSettings;
