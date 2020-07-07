const {TypeUtils} = require('@applitools/eyes-sdk-core')
const {URL} = require('url')
const {remote} = require('webdriverio')
const LegacySelector = require('./LegacySelector')

/**
 * @typedef {import('webdriverio').Browser} Driver
 * @typedef {string|Function|import('./LegacySelector')} Selector
 * @typedef {import('webdriverio').Element|{ELEMENT: string, 'element-6066-11e4-a52e-4f735466cecf': string}} Element
 *
 * @typedef {import('@applitools/eyes-sdk-core').SpecDriver<Driver, Element, Selector>} WDIOSpecDriver
 */

const LEGACY_ELEMENT_ID = 'ELEMENT'
const ELEMENT_ID = 'element-6066-11e4-a52e-4f735466cecf'

/* -------- ELEMENT -------- */

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
    [ELEMENT_ID]: this.extractId(element),
    [LEGACY_ELEMENT_ID]: this.extractId(element),
  }
}
function extractSelector(element) {
  return element.selector
}
function isStaleElementReferenceResult(result) {
  if (!result) return false
  return result instanceof Error && result.name === 'stale element reference'
}

/* -------- DRIVER -------- */

async function executeScript(driver, script, ...args) {
  return driver.execute(script, ...args)
}
async function sleep(driver, ms) {
  return driver.pause(ms)
}
async function switchToFrame(driver, reference) {
  return driver.switchToFrame(reference)
}
async function switchToParentFrame(driver) {
  return driver.switchToParentFrame()
}
async function findElement(driver, selector) {
  const element = await driver.$(
    selector instanceof LegacySelector ? selector.toString() : selector,
  )
  return !element.error ? element : null
}
async function findElements(driver, selector) {
  const elements = await driver.$$(
    selector instanceof LegacySelector ? selector.toString() : selector,
  )
  return Array.from(elements)
}
async function getWindowLocation(driver) {
  const location = TypeUtils.isFunction(driver.getWindowPosition)
    ? await driver.getWindowPosition()
    : await driver.getWindowRect()
  return {x: location.x, y: location.y}
}
async function setWindowLocation(driver, location = {}) {
  // devtools protocol doesn't support change position on runtime
  if (driver.isDevTools) return
  return TypeUtils.isFunction(driver.setWindowPosition)
    ? driver.setWindowPosition(location.x, location.y)
    : driver.setWindowRect(location.x, location.y, null, null)
}
async function getWindowSize(driver) {
  const size = TypeUtils.isFunction(driver.getWindowSize)
    ? await driver.getWindowSize()
    : await driver.getWindowRect()
  return {width: size.width, height: size.height}
}
async function setWindowSize(driver, size = {}) {
  return TypeUtils.isFunction(driver.setWindowSize)
    ? driver.setWindowSize(size.width, size.height)
    : driver.setWindowRect(null, null, size.width, size.height)
}
async function getOrientation(driver) {
  const orientation = await driver.getOrientation()
  return orientation.toLowerCase()
}
async function isMobile(driver) {
  return driver.isMobile
}
async function isAndroid(driver) {
  return driver.isAndroid
}
async function isIOS(driver) {
  return driver.isIOS
}
async function isNative(driver) {
  return driver.isMobile && !driver.capabilities.browserName
}
async function getPlatformVersion(driver) {
  return driver.capabilities.platformVersion
}
async function getBrowserName(driver) {
  return driver.capabilities.browserName
}
async function getBrowserVersion(driver) {
  return driver.capabilities.browserVersion
}
async function getSessionId(driver) {
  return driver.sessionId
}
async function takeScreenshot(driver) {
  return driver.takeScreenshot()
}
async function getTitle(driver) {
  return driver.getTitle()
}
async function getUrl(driver) {
  return driver.getUrl()
}
async function visit(driver, url) {
  return driver.url(url)
}

/* -------- TESTING -------- */

async function build({
  capabilities,
  server = process.env.CVG_TESTS_REMOTE,
  logLevel = 'silent',
  protocol = 'webdriver',
} = {}) {
  const options = {capabilities, logLevel, automationProtocol: protocol}
  const url = new URL(TypeUtils.isString(server) ? server : server.url)
  options.protocol = url.protocol ? url.protocol.replace(/:$/, '') : undefined
  options.hostname = url.hostname
  options.port = Number(url.port)
  options.path = url.pathname
  if (TypeUtils.isObject(server) && url.hostname.includes('saucelabs.com')) {
    if (server.w3c) {
      if (!options.capabilities['sauce:options']) {
        options.capabilities['sauce:options'] = {}
      }
      options.capabilities['sauce:options'].username = server.username
      options.capabilities['sauce:options'].accessKey = server.accessKey
    } else {
      options.capabilities.username = server.username
      options.capabilities.accessKey = server.accessKey
    }
  } else if (TypeUtils.isObject(server) && url.hostname.includes('browserstack.com')) {
    if (server.w3c) {
      if (!options.capabilities['bstack:options']) {
        options.capabilities['bstack:options'] = {}
      }
      options.capabilities['bstack:options'].userName = server.username
      options.capabilities['bstack:options'].accessKey = server.accessKey
    } else {
      options.capabilities['browserstack.user'] = server.username
      options.capabilities['browserstack.key'] = server.accessKey
    }
  }
  console.log(options)
  return remote(options)
}
async function cleanup(driver) {
  return driver.deleteSession()
}
async function click(driver, element) {
  const extended = await driver.$(element)
  return extended.click()
}
async function type(driver, element, keys) {
  const extended = await driver.$(element)
  return extended.setValue(keys)
}
async function waitUntilDisplayed(driver, selector, timeout) {
  const el = await this.findElement(driver, selector)
  return el.waitForDisplayed({timeout})
}
async function getElementRect(_driver, element) {
  if (TypeUtils.isFunction(element.getRect)) {
    return element.getRect()
  } else {
    const size = await element.getSize()
    const location = await element.getLocation()
    return {...location, ...size}
  }
}

/** @type {WDIOSpecDriver} */
module.exports = {
  isCompatible,
  isSelector,
  toSupportedSelector,
  toEyesSelector,
  extractId,
  extractElement,
  extractSelector,
  isStaleElementReferenceResult,
  executeScript,
  sleep,
  switchToFrame,
  switchToParentFrame,
  findElement,
  findElements,
  getWindowLocation,
  setWindowLocation,
  getWindowSize,
  setWindowSize,
  getOrientation,
  isMobile,
  isAndroid,
  isIOS,
  isNative,
  getPlatformVersion,
  getBrowserName,
  getBrowserVersion,
  getSessionId,
  takeScreenshot,
  getTitle,
  getUrl,
  visit,
  build,
  cleanup,
  click,
  type,
  waitUntilDisplayed,
  getElementRect,
}
