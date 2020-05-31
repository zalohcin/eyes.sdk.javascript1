'use strict'
const AccessibilityMatchSettings = require('../config/AccessibilityMatchSettings')
const AccessibilityRegionTypes = require('../config/AccessibilityRegionType')
const ArgumentGuard = require('../utils/ArgumentGuard')
const GetAccessibilityRegion = require('./GetAccessibilityRegion')

/**
 * @typedef {import('../config/AccessibilityRegionType').AccessibilityRegionType} AccessibilityRegionType
 */

class AccessibilityRegionByRectangle extends GetAccessibilityRegion {
  /**
   * @param {Region} rect
   * @param {AccessibilityRegionType} [type]
   */
  constructor(rect, type) {
    super()
    ArgumentGuard.isValidEnumValue(type, AccessibilityRegionTypes, false)
    this._rect = rect
    this._type = type
  }

  /**
   * @inheritDoc
   */
  async getRegion(_eyesBase, _screenshot) {
    const accessibilityRegion = new AccessibilityMatchSettings({
      left: this._rect.getLeft(),
      top: this._rect.getTop(),
      width: this._rect.getWidth(),
      height: this._rect.getHeight(),
      type: this._type,
    })
    return [accessibilityRegion]
  }

  async toPersistedRegions() {
    return [
      {
        left: this._rect.getLeft(),
        top: this._rect.getTop(),
        width: this._rect.getWidth(),
        height: this._rect.getHeight(),
        accessibilityType: this._type,
      },
    ]
  }
}

module.exports = AccessibilityRegionByRectangle
