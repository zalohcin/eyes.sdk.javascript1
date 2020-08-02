const getElementStyleProperties = require('./getElementStyleProperties')

function getTranslateOffset({
  element = document.scrollingElement || document.documentElement,
} = {}) {
  const transforms = getElementStyleProperties({
    element,
    properties: ['transform', 'webkitTransform'],
  })
  const translates = Object.keys(transforms).reduce((translates, key) => {
    if (transforms[key]) {
      const data = transforms[key].match(/^translate\(\s*(\-?[\d, \.]+)px,\s*(\-?[\d, \.]+)px\s*\)/)
      if (!data) {
        throw new Error(`Can't parse CSS transition: ${transforms[key]}!`)
      }
      translates.push({x: Math.round(-parseFloat(data[1])), y: Math.round(-parseFloat(data[2]))})
    }
    return translates
  }, [])
  const isSameOffsets = translates.every(
    offset => translates[0].x === offset.x || translates[0].y === offset.y,
  )
  if (!isSameOffsets) {
    throw new Error('Got different css positions!')
  }
  return translates[0] || {x: 0, y: 0}
}

module.exports = getTranslateOffset
