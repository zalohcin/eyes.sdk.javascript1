'use strict';

const { Location, CoordinatesType, RectangleSize, Region } = require('@applitools/eyes-common');
const { GetAccessibilityRegion, AccessibilityRegionByRectangle } = require('@applitools/eyes-sdk-core');

/**
 * @ignore
 */
class AccessibilityRegionByElement extends GetAccessibilityRegion {
  /**
   * @param {WebElement} regionSelector
   * @param {AccessibilityRegionType} regionType
   */
  constructor(regionSelector, regionType) {
    super();
    this._element = regionSelector;
    this._regionType = regionType;
  }

  // noinspection JSCheckFunctionSignatures
  /**
   * @inheritDoc
   * @param {Eyes} eyes
   * @param {EyesScreenshot} screenshot
   * @return {Promise<AccessibilityRegionByRectangle[]>}
   */
  async getRegion(eyes, screenshot) {
    const rect = await this._element.getRect();
    const pTag = screenshot.convertLocation(new Location(rect), CoordinatesType.CONTEXT_RELATIVE, CoordinatesType.SCREENSHOT_AS_IS);
    const accessibilityRegion = new Region(pTag, new RectangleSize(rect.width, rect.height));
    return new AccessibilityRegionByRectangle(accessibilityRegion, this._regionType);
  }
}

exports.AccessibilityRegionByElement = AccessibilityRegionByElement;
