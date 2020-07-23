const {EyesContext} = require('../../index')
const FakeElement = require('./FakeElement')
const spec = require('./FakeSpecDriver')

module.exports = EyesContext.specialize({
  ...spec,
  newElement(...args) {
    return new FakeElement(...args)
  },
})
