const Enum = require('../utils/Enum')

/**
 * @typedef {string} IosVersion
 */

/**
 * iOS version for visual-grid rendering
 */
const IosVersions = Enum('IosVersion', {
  Latest: 'latest',
})

module.exports = IosVersions
