function setElementOverflow(element, overflow) {
  const originalOverflow = element.style.overflow
  element.style.overflow = overflow
  return originalOverflow
}

module.exports = setElementOverflow
