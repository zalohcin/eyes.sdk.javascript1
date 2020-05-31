const Enum = require('../utils/Enum')

/**
 * @typedef {string} IosScreenOrientation
 */

const IosScreenOrientations = Enum('IosScreenOrientation', {
  PORTRAIT: 'portrait',
  LANDSCAPE_LEFT: 'landscapeLeft',
  LANDSCAPE_RIGHT: 'landscapeRight',
})

module.exports = IosScreenOrientations
