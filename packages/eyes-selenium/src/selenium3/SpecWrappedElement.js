const {TypeUtils} = require('@applitools/eyes-sdk-core')
const {WebElement, By} = require('selenium-webdriver')

/**
 * Supported selector type
 * @typedef {import('selenium-webdriver').By|import('selenium-webdriver').ByHash|string} Selector
 */

/**
 * Unwrapped element supported by framework
 * @typedef {import('selenium-webdriver').WebElement} Element
 */

function isCompatible(element) {
  return element instanceof WebElement
}

function isSelector(selector) {
  if (!selector) return false
  return (
    selector instanceof By ||
    TypeUtils.has(selector, ['using', 'value']) ||
    Object.keys(selector).some(key => key in By) ||
    TypeUtils.isString(selector)
  )
}

function toSupportedSelector(selector) {
  if (TypeUtils.has(selector, ['type', 'selector'])) {
    if (selector.type === 'css') return By.css(selector.selector)
    else if (selector.type === 'xpath') return By.xpath(selector.selector)
  }
  return selector
}

function toEyesSelector(selector) {
  if (TypeUtils.isString(selector)) {
    selector = By.css(selector)
  } else if (TypeUtils.has(selector, ['using', 'value'])) {
    selector = new By(selector.using, selector.value)
  } else if (TypeUtils.isPlainObject(selector)) {
    const using = Object.keys(selector).find(using => TypeUtils.has(By, using))
    if (using) selector = By[using](selector[using])
  }

  if (selector instanceof By) {
    const {using, value} = selector
    if (using === 'css selector') return {type: 'css', selector: value}
    else if (using === 'xpath') return {type: 'xpath', selector: value}
  }

  return {selector}
}

function extractId(element) {
  return element.getId()
}

function isStaleElementReferenceResult(result) {
  if (!result) return false
  return result instanceof Error && result.name === 'StaleElementReferenceError'
}

exports.isCompatible = isCompatible
exports.isSelector = isSelector
exports.toSupportedSelector = toSupportedSelector
exports.toEyesSelector = toEyesSelector
exports.extractId = extractId
exports.isStaleElementReferenceResult = isStaleElementReferenceResult
