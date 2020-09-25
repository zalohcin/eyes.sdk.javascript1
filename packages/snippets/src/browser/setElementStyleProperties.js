function setElementStyleProperties([element, properties] = []) {
  return Object.keys(properties).reduce((original, prop) => {
    original[prop] = {
      value: element.style.getPropertyValue(prop),
      important: Boolean(element.style.getPropertyPriority(prop)),
    }
    element.style.setProperty(
      prop,
      properties[prop].value || properties[prop],
      properties[prop].important ? 'important' : '',
    )
    return original
  }, {})
}

module.exports = setElementStyleProperties
