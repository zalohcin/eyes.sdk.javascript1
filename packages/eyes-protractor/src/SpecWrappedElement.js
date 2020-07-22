const {TypeUtils} = require('@applitools/eyes-sdk-core')
const {ProtractorBy} = require('protractor')

/**
 * @typedef {import('./SpecWrappedDriver').Driver} Driver
 * @typedef {import('protractor').Locator|string} Selector
 * @typedef {import('protractor').WebElement|import('protractor').ElementFinder} Element
 *
 * @typedef {import('@applitools/eyes-sdk-core').SpecElement<Driver, Element, Selector>} ProtractorSpecElement
 */

function isCompatible(element) {
  const ctorName = element && element.constructor && element.constructor.name
  return ctorName === 'WebElement' || ctorName === 'ElementFinder'
}
function isSelector(selector) {
  if (!selector) return false
  const by = new ProtractorBy()
  return (
    TypeUtils.isString(selector) ||
    TypeUtils.has(selector, ['using', 'value']) ||
    Object.keys(selector).some(key => key in by) ||
    TypeUtils.isFunction(selector.findElementsOverride)
  )
}
function toSupportedSelector(selector) {
  if (TypeUtils.has(selector, ['type', 'selector'])) {
    if (selector.type === 'css') return {css: selector.selector}
    else if (selector.type === 'xpath') return {xpath: selector.selector}
  }
  return selector
}
function toEyesSelector(selector) {
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
}
function extractId(element) {
  return element.getId()
}
function isStaleElementReferenceResult(result) {
  if (!result) return false
  const errOrResult = result.originalError || result
  return errOrResult instanceof Error && errOrResult.name === 'StaleElementReferenceError'
}

/** @type {ProtractorSpecElement} */
module.exports = {
  isCompatible,
  isSelector,
  toSupportedSelector,
  toEyesSelector,
  extractId,
  isStaleElementReferenceResult,
}
