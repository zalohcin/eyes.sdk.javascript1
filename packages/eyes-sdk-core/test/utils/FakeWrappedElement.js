const {TypeUtils} = require('@applitools/eyes-common')
const {EyesWrappedElement} = require('../../index')

module.exports = EyesWrappedElement.specialize({
  isCompatible(element) {
    return TypeUtils.has(element, 'id')
  },
  isSelector(selector) {
    return TypeUtils.isString(selector) || TypeUtils.has(selector, ['using', 'value'])
  },
  extractId(element) {
    return element.id
  },
})
