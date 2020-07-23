const {EyesDriver} = require('../../index')
const FakeContext = require('./FakeContext')
const FakeElement = require('./FakeElement')
const spec = require('./FakeSpecDriver')

module.exports = EyesDriver.specialize({
  ...spec,
  newContext(...args) {
    return new FakeContext(...args)
  },
  newElement(...args) {
    return new FakeElement(...args)
  },
})
