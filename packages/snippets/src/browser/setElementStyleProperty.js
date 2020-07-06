function setElementStyleProperty({element, property, value} = {}) {
  const original = element.style[property]
  element.style[property] = value
  return original
}

module.exports = setElementStyleProperty
