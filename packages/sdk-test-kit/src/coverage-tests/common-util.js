function getNameFromObject(object) {
  return Object.keys(object)[0]
}

function filter(filter, {from, inside}) {
  return filter
    ? inside.filter(entry => {
        try {
          return entry[from].includes(filter)
        } catch (error) {
          return entry[from].hasOwnProperty(filter)
        }
      })
    : inside
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

module.exports = {
  filter,
  findDifferencesBetweenCollections,
  getNameFromObject,
}
