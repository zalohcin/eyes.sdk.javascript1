const Enum = require('../utils/Enum')

/**
 * @typedef {string} ScreenOrientation
 */

/**
 * Represents the types of available stitch modes.
 */
const ScreenOrientations = Enum('ScreenOrientation', {
  PORTRAIT: 'portrait',
  LANDSCAPE: 'landscape',
})

module.exports = ScreenOrientations
