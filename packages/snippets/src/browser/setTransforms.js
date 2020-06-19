const {TRANSFORM_KEYS} = require('../constants')

function setTransforms(transforms, element = document.documentElement) {
  TRANSFORM_KEYS.forEach(key => {
    element.style[key] = typeof transforms === 'string' ? transforms : transforms[key]
  })
}

module.exports = setTransforms
