const assert = require('assert')
const {makeResourcePool, findResourceInPool} = require('../../src/resource-pool/index')

describe('resource-pool', () => {
  it('should return a collection of n resources', async () => {
    const pool = await makeResourcePool(2)
    assert.ok(pool.length === 2)
  })

  it('should find a resource from a pool', async () => {
    const pool = await makeResourcePool(1)
    assert.ok(
      await findResourceInPool(
        pool,
        entry => {
          return entry === 'blah'
        },
        1,
      ),
    )
  })

  it('should throw if a resource is not found in the pool', async () => {
    const pool = await makeResourcePool(1)
    assert.rejects(async () => {
      await findResourceInPool(
        pool,
        entry => {
          return entry === 'asdf'
        },
        1,
      )
    })
  })
})
