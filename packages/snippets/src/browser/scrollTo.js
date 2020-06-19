function scrollTo(offset, element = document.documentElement) {
  if (element.scrollTo) {
    element.scrollTo(offset.x, offset.y)
  } else {
    element.scrollTop = offset.x
    element.scrollLeft = offset.y
  }
  return {x: element.scrollLeft, y: element.scrollTop}
}

module.exports = scrollTo
