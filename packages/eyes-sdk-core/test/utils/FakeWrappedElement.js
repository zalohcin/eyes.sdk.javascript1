const {TypeUtils, EyesWrappedElement} = require('../../index')

module.exports = EyesWrappedElement.specialize({
  isCompatible(element) {
    return TypeUtils.has(element, 'id')
  },
  isSelector(selector) {
    return TypeUtils.isString(selector) || TypeUtils.has(selector, ['using', 'value'])
  },
  toSupportedSelector(selector) {
    if (TypeUtils.has(selector, ['type', 'selector'])) {
      return selector.selector
    }
    return selector
  },
  extractId(element) {
    return element.id
  },
})
