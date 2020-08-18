function getNameFromObject(object) {
  return Object.keys(object)[0]
}

function findDifferencesBetweenCollections(hostCollection = [], guestCollection = []) {
  const _hostCollection = Array.isArray(hostCollection)
    ? hostCollection
    : Object.keys(hostCollection)
  const _guestCollection = Array.isArray(guestCollection)
    ? new Set(guestCollection)
    : new Set(Object.keys(guestCollection))
  return _hostCollection.filter(test => !_guestCollection.has(test))
}

function isFunction(value) {
  return typeof value === 'function'
}

function isObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function mergeObjects(base, other) {
  return Object.entries(other).reduce((merged, [key, value]) => {
    if (key in merged) {
      merged[key] = isObject(value) ? mergeObjects(merged[key], value) : value
    } else {
      merged[key] = value
    }
    return merged
  }, Object.assign({}, base))
}

function capitalize(string) {
  return string[0].toUpperCase() + string.slice(1)
}

module.exports = {
  findDifferencesBetweenCollections,
  getNameFromObject,
  mergeObjects,
  isFunction,
  isObject,
  capitalize,
}
