const {Frame} = require('../../index')
const FakeWrappedElement = require('./FakeWrappedElement')

module.exports = Frame.specialize({
  isSelector(selector) {
    return FakeWrappedElement.isSelector(selector)
  },
  isCompatibleElement(element) {
    return FakeWrappedElement.isCompatible(element)
  },
  createElement(logger, driver, element, selector) {
    return new FakeWrappedElement(logger, driver, element, selector)
  },
})
