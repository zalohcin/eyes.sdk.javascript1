const {TypeUtils} = require('@applitools/eyes-sdk-core')

// #region HELPERS

async function handleToObject(handle) {
  const type = handle._objectType
  if (type === 'array') {
    const map = await handle.getProperties()
    return Promise.all(Array.from(map.values(), handleToObject))
  } else if (type === 'object') {
    const map = await handle.getProperties()
    const chunks = await Promise.all(
      Array.from(map, async ([key, handle]) => ({[key]: await handleToObject(handle)})),
    )
    return Object.assign(...chunks)
  } else if (type === 'node') {
    return handle.asElement()
  } else {
    return handle.jsonValue()
  }
}

function transformSelector(selector) {
  if (TypeUtils.has(selector, ['type', 'selector'])) {
    if (selector.type === 'css') return `css=${selector.selector}`
    else if (selector.type === 'xpath') return `xpath=${selector.selector}`
  }
  return selector
}

// #endregion

// #region UTILITY

function isDriver(page) {
  return page.constructor.name === 'Page'
}
function isElement(element) {
  if (!element) return false
  return element.constructor.name === 'ElementHandle'
}
function isSelector(selector) {
  return TypeUtils.isString(selector)
}
function toEyesSelector(selector) {
  if (!TypeUtils.isString(selector)) return {selector}
  if (selector.includes('>>')) return {selector}
  if (selector.startsWith('//')) return {type: 'xpath', selector}

  const match = selector.match(/(css:light|xpath)=(.+)/)
  if (!match) return {selector}
  const [_, type, value] = match
  if (type === 'css:light') return {type: 'css', selector: value}
  else if (type === 'xpath') return {type: 'xpath', selector: value}
}

// #endregion

// #region COMMANDS

async function isEqualElements(frame, element1, element2) {
  return frame.evaluate(([element1, element2]) => element1 === element2, [element1, element2])
}
async function executeScript(frame, script, arg) {
  const result = await frame.evaluateHandle(script, arg)
  return handleToObject(result)
}
async function mainContext(frame) {
  return frame._page.mainFrame()
}
async function parentContext(frame) {
  return frame.parentFrame()
}
async function childContext(_frame, element) {
  return element.contentFrame()
}
async function findElement(frame, selector) {
  return frame.$(transformSelector(selector))
}
async function findElements(frame, selector) {
  return frame.$$(transformSelector(selector))
}
async function getViewportSize(page) {
  return page.viewportSize()
}
async function setViewportSize(page, size = {}) {
  return page.setViewportSize(size)
}
async function getTitle(page) {
  return page.title()
}
async function getUrl(page) {
  return page.url()
}
async function visit(page, url) {
  return page.goto(url)
}
async function takeScreenshot(driver) {
  return driver.takeScreenshot()
}

// #endregion

// #region TESTING

const browserNames = {
  chrome: 'chromium',
  safari: 'webkit',
  firefox: 'firefox',
}

async function build({browser, device, headless, args} = {}) {
  const playwright = require('playwright')
  const driver = await playwright[browserNames[browser] || browser].launch({headless, args})
  const context = await driver.newContext(device ? playwright.devices[device] : {})
  return context.newPage()
}
async function cleanup(page) {
  return page.context()._browserBase.close()
}
async function click(_frame, element) {
  return element.click()
}
async function type(_frame, element, keys) {
  return element.type(keys)
}

// #endregion

exports.isDriver = isDriver
exports.isElement = isElement
exports.isSelector = isSelector
exports.isEqualElements = isEqualElements
exports.toEyesSelector = toEyesSelector

exports.executeScript = executeScript
exports.mainContext = mainContext
exports.parentContext = parentContext
exports.childContext = childContext
exports.findElement = findElement
exports.findElements = findElements
exports.getViewportSize = getViewportSize
exports.setViewportSize = setViewportSize
exports.getTitle = getTitle
exports.getUrl = getUrl
exports.visit = visit
exports.takeScreenshot = takeScreenshot

exports.build = build
exports.cleanup = cleanup
exports.click = click
exports.type = type
