'use strict';
const {CheckSettings, Region} = require('@applitools/eyes.sdk.core');

function createCheckSettings({ignore}) {
  const checkSettings = new CheckSettings(0);
  if (ignore) {
    ignore = [].concat(ignore);
    for (const region of ignore) {
      checkSettings.ignoreRegions(Region.fromObject(region));
    }
  }
  return checkSettings;
}

module.exports = createCheckSettings;
