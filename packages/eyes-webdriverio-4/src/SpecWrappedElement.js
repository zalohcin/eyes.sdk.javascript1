const {TypeUtils} = require('@applitools/eyes-sdk-core')

const LEGACY_ELEMENT_ID = 'ELEMENT'
const ELEMENT_ID = 'element-6066-11e4-a52e-4f735466cecf'

module.exports = {
  isCompatible(element) {
    if (!element) return false
    return element.value
      ? Boolean(element.value[ELEMENT_ID] || element.value[LEGACY_ELEMENT_ID])
      : Boolean(element[ELEMENT_ID] || element[LEGACY_ELEMENT_ID])
  },
  isSelector(selector) {
    return TypeUtils.isString(selector)
  },
  extractId(element) {
    return element[ELEMENT_ID] || element[LEGACY_ELEMENT_ID]
  },
  extractElement(element) {
    const unwrapped = element.value ? element.value : element
    return {
      [ELEMENT_ID]: this.extractId(unwrapped),
      [LEGACY_ELEMENT_ID]: this.extractId(unwrapped),
    }
  },
  extractSelector(element) {
    return element.selector
  },
  isStaleElementReferenceResult(result, wrapper) {
    if (!result) return false
    return result instanceof Error
      ? result.seleniumStack && result.seleniumStack.type === 'StaleElementReference'
      : result.value && result.selector && result.selector === wrapper.selector
  },
}
