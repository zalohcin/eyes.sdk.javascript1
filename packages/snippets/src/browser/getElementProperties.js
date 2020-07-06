function getElementProperties({element, properties = []} = {}) {
  return properties.map(property => element[property])
}

module.exports = getElementProperties
