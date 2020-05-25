const {EyesVisualGrid} = require('../../index')
const WrappedDriver = require('./FakeWrappedDriver')
const WrappedElement = require('./FakeWrappedElement')
const CheckSettings = require('./FakeCheckSettings')

module.exports = EyesVisualGrid.specialize({
  agentId: `eyes.fake.visualgrid.javascript/0.1.0`,
  WrappedDriver,
  WrappedElement,
  CheckSettings,
  VisualGridClient: {
    makeVisualGridClient() {
      return {}
    },
  },
})
