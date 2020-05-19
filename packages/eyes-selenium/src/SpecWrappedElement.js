const {WebElement, By} = require('selenium-webdriver')

/**
 * Supported selector type
 * @typedef {By} SupportedSelector
 */

/**
 * Compatible element type
 * @typedef {UnwrappedElement} SupportedElement
 */

/**
 * Unwrapped element supported by framework
 * @typedef {WebElement} UnwrappedElement
 */

module.exports = {
  isCompatible(element) {
    return element instanceof WebElement
  },
  isSelector(selector) {
    return selector instanceof By
  },
  extractId(element) {
    return element.getId()
  },
  isStaleElementReferenceResult(result) {
    if (!result) return false
    return result instanceof Error && result.name === 'StaleElementReferenceError'
  },
}
