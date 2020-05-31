const Enum = require('../utils/Enum')

/**
 * @typedef {string} AccessibilityLevel
 */

/**
 * The extent in which to check the image visual accessibility level.
 */
const AccessibilityLevels = Enum('AccessibilityLevel', {
  /** Low accessibility level. */
  AA: 'AA',
  /** Highest accessibility level. */
  AAA: 'AAA',
})

module.exports = AccessibilityLevels
