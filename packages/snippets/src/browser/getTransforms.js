const {TRANSFORM_KEYS} = require('../constants')

function getTransforms(element = document.documentElement) {
  return TRANSFORM_KEYS.reduce(function(transforms, key) {
    transforms[key] = element.style[key]
    return transforms
  }, {})
}

module.exports = getTransforms
