const setTransforms = require('./setTransforms')

function translateTo(location, element = document.documentElement) {
  setTransforms(`translate(${-location.x}px, ${-location.y}px)`, element)
  return location
}

module.exports = translateTo
