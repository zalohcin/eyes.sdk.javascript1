const findFixedAncestor = require('./findFixedAncestor')
const isElementScrollable = require('./isElementScrollable')
const getScrollOffset = require('./getScrollOffset')

module.exports = function getElementRect(element, isClient = false) {
  const elementBoundingClientRect = element.getBoundingClientRect()
  const rect = {
    x: elementBoundingClientRect.left,
    y: elementBoundingClientRect.top,
    width: elementBoundingClientRect.width,
    height: elementBoundingClientRect.height,
  }
  if (isClient) {
    const elementComputedStyle = window.getComputedStyle(element)
    rect.x += Number.parseInt(elementComputedStyle.getPropertyValue('border-left-width'))
    rect.y += Number.parseInt(elementComputedStyle.getPropertyValue('border-top-width'))
    rect.width = element.clientWidth
    rect.height = element.clientHeight
  }
  const fixedAncestor = findFixedAncestor(element)
  if (fixedAncestor) {
    const isFixedAncestorScrollable = isElementScrollable(fixedAncestor)
    if (fixedAncestor !== element && isFixedAncestorScrollable) {
      const fixedAncestorScrollOffset = getScrollOffset(fixedAncestor)
      rect.x += fixedAncestorScrollOffset.x
      rect.y += fixedAncestorScrollOffset.y
    }
  } else {
    rect.x += window.scrollX || window.pageXOffset
    rect.y += window.scrollY || window.pageYOffset
  }
  return rect
}
