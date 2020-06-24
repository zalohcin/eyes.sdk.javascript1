const {TypeUtils} = require('@applitools/eyes-sdk-core')
const LegacySelector = require('./LegacySelector')

/**
 * Supported selector type
 * @typedef {string|Function|import('./LegacySelector')} Selector
 */

/**
 * Compatible element type
 * @typedef {import('webdriverio').Element|PlainElement} Element
 */

/**
 * Plain element object type
 * @typedef {{ELEMENT: string, 'element-6066-11e4-a52e-4f735466cecf': string}} PlainElement
 */

const LEGACY_ELEMENT_ID = 'ELEMENT'
const ELEMENT_ID = 'element-6066-11e4-a52e-4f735466cecf'

function isCompatible(element) {
  if (!element) return false
  return Boolean(element.elementId || element[ELEMENT_ID] || element[LEGACY_ELEMENT_ID])
}

function isSelector(selector) {
  return (
    TypeUtils.isString(selector) ||
    TypeUtils.isFunction(selector) ||
    selector instanceof LegacySelector
  )
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

function extractId(element) {
  return element.elementId || element[ELEMENT_ID] || element[LEGACY_ELEMENT_ID]
}

function extractElement(element) {
  return {
    [ELEMENT_ID]: extractId(element),
    [LEGACY_ELEMENT_ID]: extractId(element),
  }
}

function extractSelector(element) {
  return element.selector
}

function isStaleElementReferenceResult(result) {
  if (!result) return false
  return result instanceof Error && result.name === 'stale element reference'
}

exports.isCompatible = isCompatible
exports.isSelector = isSelector
exports.toSupportedSelector = toSupportedSelector
exports.toEyesSelector = toEyesSelector
exports.extractId = extractId
exports.extractElement = extractElement
exports.extractSelector = extractSelector
exports.isStaleElementReferenceResult = isStaleElementReferenceResult
