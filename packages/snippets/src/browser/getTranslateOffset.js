const getTransforms = require('./getTransforms')

function getTranslateOffset(element = document.documentElement) {
  var transforms = getTransforms(element)
  var translates = Object.keys(transforms).reduce((translates, key) => {
    var transform = transforms[key]
    if (transform) {
      var data = transform.match(/^translate\(\s*(\-?[\d, \.]+)px,\s*(\-?[\d, \.]+)px\s*\)/)
      if (!data) {
        throw new Error(`Can't parse CSS transition: ${transform}!`)
      }
      translates.push({
        x: Math.round(-parseFloat(data[1])),
        y: Math.round(-parseFloat(data[2])),
      })
    }
    return translates
  }, [])
  var isSameOffsets = translates.every(
    offset => translates[0].x === offset.x || translates[0].y === offset.y,
  )
  if (!isSameOffsets) {
    throw new Error('Got different css positions!')
  }
  return translates[0] || {x: 0, y: 0}
}

module.exports = getTranslateOffset
