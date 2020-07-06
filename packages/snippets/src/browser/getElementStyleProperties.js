function getElementStyleProperties({element, properties = []} = {}) {
  return properties.map(property => element.style[property])
}

module.exports = getElementStyleProperties
