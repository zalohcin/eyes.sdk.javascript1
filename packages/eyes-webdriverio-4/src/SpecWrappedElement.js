const {TypeUtils} = require('@applitools/eyes-sdk-core')
const LegacySelector = require('./LegacySelector')

/**
 * @typedef {import('./SpecWrappedDriver').Driver} Driver
 * @typedef {string|LegacySelector} Selector
 * @typedef {import('webdriverio').Element|{value: import('webdriverio').Element, selector?: string}} Element
 * @typedef {import('@applitools/eyes-sdk-core').SpecElement<Driver, Element, Selector>} WDIOSpecElement
 */

const LEGACY_ELEMENT_ID = 'ELEMENT'
const ELEMENT_ID = 'element-6066-11e4-a52e-4f735466cecf'

function isCompatible(element) {
  if (!element) return false
  return element.value
    ? Boolean(element.value[ELEMENT_ID] || element.value[LEGACY_ELEMENT_ID])
    : Boolean(element[ELEMENT_ID] || element[LEGACY_ELEMENT_ID])
}
function isSelector(selector) {
  return TypeUtils.isString(selector) || selector instanceof LegacySelector
}
function extractId(element) {
  return element[ELEMENT_ID] || element[LEGACY_ELEMENT_ID]
}
function toSupportedSelector(selector) {
  if (TypeUtils.has(selector, ['type', 'selector'])) {
    if (selector.type === 'css') return `css selector:${selector.selector}`
    else if (selector.type === 'xpath') return `xpath:${selector.selector}`
  }
  return selector
}
function toEyesSelector(selector) {
  if (selector instanceof LegacySelector) {
    const {using, value} = selector
    if (using === 'css selector') return {type: 'css', selector: value}
    else if (using === 'xpath') return {type: 'xpath', selector: value}
  } else if (TypeUtils.isString(selector)) {
    const match = selector.match(/(css selector|xpath):(.+)/)
    if (match) {
      const [_, using, value] = match
      if (using === 'css selector') return {type: 'css', selector: value}
      else if (using === 'xpath') return {type: 'xpath', selector: value}
    }
  }
  return {selector}
}
function extractElement(element) {
  const unwrapped = element.value ? element.value : element
  return {
    [ELEMENT_ID]: extractId(unwrapped),
    [LEGACY_ELEMENT_ID]: extractId(unwrapped),
  }
}
function extractSelector(element) {
  return element.selector
}
function isStaleElementReferenceResult(result, wrapper) {
  if (!result) return false
  const errOrResult = result.originalError || result
  return errOrResult instanceof Error
    ? errOrResult.seleniumStack && errOrResult.seleniumStack.type === 'StaleElementReference'
    : errOrResult.value && errOrResult.selector && errOrResult.selector === wrapper.selector
}

/** @type {WDIOSpecElement} */
module.exports = {
  isCompatible,
  isSelector,
  extractId,
  toSupportedSelector,
  toEyesSelector,
  extractElement,
  extractSelector,
  isStaleElementReferenceResult,
}
