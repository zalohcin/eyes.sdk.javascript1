'use strict'

const {CheckSettings} = require('@applitools/eyes-sdk-core')
const {IgnoreRegionBySelector} = require('./IgnoreRegionBySelector')
const {FloatingRegionBySelector} = require('./FloatingRegionBySelector')
const {EyesWebElement} = require('../wrappers/EyesWebElement')

class TestcafeCheckSettings extends CheckSettings {
  /**
   * @protected
   * @param {Region} region
   */
  _regionToRegionProvider(region) {
    if (EyesWebElement.isLocator(region)) {
      return new IgnoreRegionBySelector(region)
    }

    // if (region instanceof WebElement) {
    //   return new IgnoreRegionByElement(region)
    // }

    return super._regionToRegionProvider(region)
  }

  /**
   * @param {GetFloatingRegion|Region|FloatingMatchSettings|By|WebElement|EyesWebElement} regionOrContainer - The content
   *   rectangle or region container
   * @param {number} [maxUpOffset] - How much the content can move up.
   * @param {number} [maxDownOffset] - How much the content can move down.
   * @param {number} [maxLeftOffset] - How much the content can move to the left.
   * @param {number} [maxRightOffset] - How much the content can move to the right.
   * @return {this}
   */
  floatingRegion(regionOrContainer, maxUpOffset, maxDownOffset, maxLeftOffset, maxRightOffset) {
    if (EyesWebElement.isLocator(regionOrContainer)) {
      const floatingRegion = new FloatingRegionBySelector(
        regionOrContainer,
        maxUpOffset,
        maxDownOffset,
        maxLeftOffset,
        maxRightOffset,
      )
      this._floatingRegions.push(floatingRegion)
    } /*  else if (regionOrContainer instanceof WebElement) {
      const floatingRegion = new FloatingRegionByElement(
        regionOrContainer,
        maxUpOffset,
        maxDownOffset,
        maxLeftOffset,
        maxRightOffset,
      )
      this._floatingRegions.push(floatingRegion)
    }  */ else {
      super.floatingRegion(
        regionOrContainer,
        maxUpOffset,
        maxDownOffset,
        maxLeftOffset,
        maxRightOffset,
      )
    }
    return this
  }
}

exports.TestcafeCheckSettings = TestcafeCheckSettings
