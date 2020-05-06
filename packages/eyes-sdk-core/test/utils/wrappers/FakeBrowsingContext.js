const {Frame, EyesBrowsingContext} = require('../../../index')
const WrappedElement = require('./FakeWrappedElement')

const FakeFrame = Frame.specialize({WrappedElement})

class FakeBrowsingContext extends EyesBrowsingContext {
  constructor() {
    super()
  }
}

module.exports = FakeBrowsingContext
