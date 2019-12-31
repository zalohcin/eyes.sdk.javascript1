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

function unique(collection = []) {
  return new Set(collection)
}

function findDifferencesBetween(hostCollection, guestCollection) {
  const _guestCollection = new Set(guestCollection)
  return hostCollection.filter(test => !_guestCollection.has(test))
}

module.exports = {
  filter,
  unique,
  findDifferencesBetween,
}
