const {TypeUtils} = require('@applitools/eyes-sdk-core')

//// #region HELPERS
function extractElementId(element) {
  const _element = element.value ? element.value : element
  return Object.values(_element)[0]
}
function getCapabilities(driver, opts) {
  return opts.using ? opts.using : driver.capabilities
}
//// #endregion

//// #region UTILITY
function isDriver(driver) {
  return TypeUtils.instanceOf(driver, 'NightwatchAPI')
}
function isElement(element) {
  if (!element || element.error) return false
  return !!extractElementId(element)
}
function isSelector(selector) {
  if (!selector) return false
  return TypeUtils.isString(selector)
}
function isStaleElementError(error) {
  if (!error) return false
  return error instanceof Error && error.name === 'StaleElementReference'
}
function isEqualElements(_driver, element1, element2) {
  if (!element1 || !element2) return false
  const elementId1 = extractElementId(element1)
  const elementId2 = extractElementId(element2)
  return Boolean(elementId1 === elementId2)
}
//// #endregion

//// #region COMMANDS
async function executeScript(driver, script, ...args) {
  const result = await driver.execute(script, args)
  return result.value
}
async function mainContext(driver) {
  await driver.frame()
}
async function parentContext(driver) {
  await driver.frameParent()
}
async function childContext(driver, element) {
  if (isSelector(element)) {
    element = await driver.element('css selector', element)
  }
  await driver.frame(element.value)
}
async function findElement(driver, selector) {
  if (TypeUtils.isString(selector)) {
    const element = await driver.element('css selector', selector)
    return element.value
  }
}
async function findElements(driver, selector) {
  if (TypeUtils.isString(selector)) {
    const elements = await driver.elements('css selector', selector)
    return elements.value
  }
}
async function getElementRect(driver, element) {
  const location = await driver.elementIdLocation(extractElementId(element))
  const size = await driver.elementIdSize(extractElementId(element))
  return {
    x: Math.round(location.value.x),
    y: Math.round(location.value.y),
    width: Math.round(size.value.width),
    height: Math.round(size.value.height),
  }
}
async function getWindowRect(driver) {
  const result = await driver.getWindowRect()
  return result && result.value ? result.value : result
}
async function setWindowRect(driver, rect = {}) {
  await driver.setWindowRect(rect)
}
function getOrientation(driver, opts = {}) {
  const capabilities = getCapabilities(driver, opts)
  const orientation = capabilities.orientation || capabilities.deviceOrientation
  return orientation ? orientation.toLowerCase() : 'portrait'
}
function getDriverInfo(driver, opts = {}) {
  const sessionId = driver.sessionId
  const capabilities = getCapabilities(driver, opts)
  const browserName = capabilities.browserName
  const deviceName = capabilities.device ? capabilities.device : capabilities.deviceName
  const platformName = capabilities.platformName || capabilities.platform
  const platformVersion = capabilities.osVersion
    ? capabilities.osVersion
    : capabilities.platformVersion
  const isMobile = ['android', 'ios'].includes(platformName && platformName.toLowerCase())
  const isNative = isMobile && !browserName
  return {
    deviceName,
    isMobile,
    isNative,
    platformName,
    platformVersion,
    sessionId,
  }
}
async function getTitle(driver) {
  return driver.title()
}
async function getUrl(driver) {
  const result = await driver.url()
  return result.value
}
async function visit(driver, url) {
  return driver.url(url)
}
async function takeScreenshot(driver) {
  // NOTE: passing a callback is needed in order to return the screenshot
  // simply awaiting on the result returns undefined
  const fn = result => {
    return Buffer.from(result.value, 'base64')
  }
  return await driver.screenshot(true, fn)
}
async function click(driver, element) {
  if (isSelector(element)) {
    const selector = element
    return await driver.click('css selector', selector)
  }
  await driver.elementIdClick(extractElementId(element))
}
async function type(driver, element, keys) {
  if (isSelector(element)) {
    const selector = element
    return await driver.setValue('css selector', selector, keys)
  }
  await driver.elementIdValue(extractElementId(element), keys)
}
async function waitUntilDisplayed(driver, selector, timeout) {
  await driver.waitForElementVisible('css selector', selector, timeout)
}
async function scrollIntoView(driver, element) {
  // NOTE: moveTo will scroll the element into view, but it also moves the mouse
  // cursor to the element. This might have unintended side effects.
  // Will need to wait and see, since there's no simple alternative.
  await driver.moveTo(extractElementId(element))
}
async function hover(driver, element, {x, y} = {}) {
  if (isSelector(element)) {
    const selector = element
    return await driver.moveToElement('css selector', selector, x, y)
  }
  await driver.moveTo(extractElementId(element), x, y)
}
//
//// #endregion
//
exports.isDriver = isDriver
exports.isElement = isElement
exports.isSelector = isSelector
exports.isEqualElements = isEqualElements
exports.isStaleElementError = isStaleElementError
exports.executeScript = executeScript
exports.mainContext = mainContext
exports.parentContext = parentContext
exports.childContext = childContext
exports.findElement = findElement
exports.findElements = findElements
exports.getElementRect = getElementRect
exports.getWindowRect = getWindowRect
exports.setWindowRect = setWindowRect
exports.getOrientation = getOrientation
exports.getDriverInfo = getDriverInfo
exports.getTitle = getTitle
exports.getUrl = getUrl
exports.visit = visit
exports.takeScreenshot = takeScreenshot
exports.click = click
exports.type = type
exports.waitUntilDisplayed = waitUntilDisplayed
exports.scrollIntoView = scrollIntoView
exports.hover = hover
// for tests
exports.build = () => {
  return [{}, () => {}]
}
exports.extractElementId = extractElementId
