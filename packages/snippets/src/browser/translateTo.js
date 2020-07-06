const setElementStyleProperty = require('./setElementStyleProperty')

function translateTo({offset, element = document.documentElement} = {}) {
  const value = `translate(${-offset.x}px, ${-offset.y}px)`
  setElementStyleProperty({element, property: 'transform', value})
  setElementStyleProperty({element, property: 'webkitTransform', value})
  return offset
}

module.exports = translateTo
