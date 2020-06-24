const {TypeUtils} = require('@applitools/eyes-sdk-core')
const {ProtractorBy} = require('protractor')

/**
 * Supported selector type
 * @typedef {import('protractor').Locator|string} Selector
 */

/**
 * Compatible element type
 * @typedef {import('protractor').WebElement|import('protractor').ElementFinder} Element
 */

module.exports = {
  isCompatible(element) {
    const ctorName = element && element.constructor && element.constructor.name
    return ctorName === 'WebElement' || ctorName === 'ElementFinder'
  },
  isSelector(selector) {
    if (!selector) return false
    const by = new ProtractorBy()
    return (
      TypeUtils.isString(selector) ||
      TypeUtils.has(selector, ['using', 'value']) ||
      Object.keys(selector).some(key => key in by) ||
      TypeUtils.isFunction(selector.findElementsOverride)
    )
  },
  toSupportedSelector(selector) {
    if (TypeUtils.has(selector, ['type', 'selector'])) {
      if (selector.type === 'css') return {css: selector.selector}
      else if (selector.type === 'xpath') return {xpath: selector.selector}
    }
    return selector
  },
  toEyesSelector(selector) {
    if (!TypeUtils.has(selector, ['using', 'value'])) {
      const by = new ProtractorBy()
      if (TypeUtils.isString(selector)) {
        selector = by.css(selector)
      } else if (TypeUtils.isPlainObject(selector)) {
        const using = Object.keys(selector).find(using => TypeUtils.has(by, using))
        if (using) selector = by[using](selector[using])
      } else {
        return {selector}
      }
    }

    const {using, value} = selector
    if (using === 'css selector') return {type: 'css', selector: value}
    else if (using === 'xpath') return {type: 'xpath', selector: value}
    else return {selector}
  },
  extractId(element) {
    return element.getId()
  },
  isStaleElementReferenceResult(result) {
    if (!result) return false
    return result instanceof Error && result.name === 'StaleElementReferenceError'
  },
}
