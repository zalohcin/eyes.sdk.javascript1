const getScrollOffset = require('./getScrollOffset')
const getTranslateOffset = require('./getTranslateOffset')

function getInnerOffset(element) {
  const scroll = getScrollOffset(element)
  const translate = getTranslateOffset(element)
  return {x: scroll.x + translate.x, y: scroll.y + translate.y}
}

module.exports = getInnerOffset
