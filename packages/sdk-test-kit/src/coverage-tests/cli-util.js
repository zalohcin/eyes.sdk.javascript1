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

module.exports = {
  filter,
}
