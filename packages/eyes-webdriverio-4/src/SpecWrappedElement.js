const {TypeUtils} = require('@applitools/eyes-sdk-core')
const LegacySelector = require('./LegacySelector')

/**
 * Supported selector type
 * @typedef {string|LegacySelector} Selector
 */

/**
 * Compatible element type
 * @typedef {PlainElement|{value: PlainElement, selector?: string}} Element
 */

/**
 * Plain element object type
 * @typedef {{ELEMENT: string, 'element-6066-11e4-a52e-4f735466cecf': string}} PlainElement
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
  return result instanceof Error
    ? result.seleniumStack && result.seleniumStack.type === 'StaleElementReference'
    : result.value && result.selector && result.selector === wrapper.selector
}

exports.isCompatible = isCompatible
exports.isSelector = isSelector
exports.extractId = extractId
exports.toSupportedSelector = toSupportedSelector
exports.toEyesSelector = toEyesSelector
exports.extractElement = extractElement
exports.extractSelector = extractSelector
exports.isStaleElementReferenceResult = isStaleElementReferenceResult
