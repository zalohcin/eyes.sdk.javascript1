const {makeRun} = require('./coverage-tests/index')
const {makeResourcePool, findResourceInPool} = require('./resource-pool/index')

module.exports = {
  makeRun,
  makeResourcePool,
  findResourceInPool,
}
