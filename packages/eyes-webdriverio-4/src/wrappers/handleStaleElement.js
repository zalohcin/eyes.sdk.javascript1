function handleStaleElement(executor, refresher) {
  return async (...args) => {
    try {
      const result = await executor(...args)
      return result
    } catch (err) {
      if (!err.seleniumStack || err.seleniumStack.type !== 'StaleElementReference') throw err
      const refreshed = await refresher()
      if (refreshed) return executor(...args)
      else throw err
    }
  }
}

module.exports = handleStaleElement
