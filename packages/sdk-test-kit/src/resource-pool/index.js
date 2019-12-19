async function makeResourcePool(
  size = 10,
  init = async () => {
    return 'blah'
  },
) {
  const pool = []
  const times = Array(size).fill()
  for (const _time in times) {
    pool.push(await init())
  }
  return pool
}

async function findResourceInPool(resourcePool, lookupFunction, timeout = 120) {
  let count = 0
  let resource
  do {
    await new Promise(r => setTimeout(r, 1000))
    count++
    if (count > timeout)
      throw `Resource not available from the pool in a reasonable amount of time (${timeout} seconds).`
    resource = resourcePool.find(lookupFunction)
  } while (!resource)
  return resource
}

module.exports = {
  makeResourcePool,
  findResourceInPool,
}
