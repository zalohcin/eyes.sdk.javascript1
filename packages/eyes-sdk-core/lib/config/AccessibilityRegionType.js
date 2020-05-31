const Enum = require('../utils/Enum')

/**
 * @typedef {string} AccessibilityRegionType
 */

/**
 * The type of accessibility for a region.
 */
const AccessibilityRegionTypes = Enum('AccessibilityRegionType', {
  IgnoreContrast: 'IgnoreContrast',
  RegularText: 'RegularText',
  LargeText: 'LargeText',
  BoldText: 'BoldText',
  GraphicalObject: 'GraphicalObject',
})

module.exports = AccessibilityRegionTypes
