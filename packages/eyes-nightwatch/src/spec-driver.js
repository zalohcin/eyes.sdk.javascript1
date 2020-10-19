const {TypeUtils} = require('@applitools/eyes-sdk-core')
//
//// #region HELPERS
//
//const byHash = [
//  'className',
//  'css',
//  'id',
//  'js',
//  'linkText',
//  'name',
//  'partialLinkText',
//  'tagName',
//  'xpath',
//]
//
function extractElementId(element) {
  const _element = element.value ? element.value : element
  return _element.ELEMENT
}
async function getFrameId(driver, element) {
  const name = await driver.elementIdAttribute(extractElementId(element), 'name')
  if (name) return name.value
  const id = await driver.elementIdAttribute(extractElementId(element), 'id')
  if (id) return id.value
}
//
//function transformSelector(selector) {
//  if (TypeUtils.has(selector, ['type', 'selector'])) {
//    if (selector.type === 'css') return {css: selector.selector}
//    else if (selector.type === 'xpath') return {xpath: selector.selector}
//  }
//  return selector
//}
//
//// #endregion
//
//// #region UTILITY
//
function isDriver(driver) {
  return TypeUtils.instanceOf(driver, 'NightwatchAPI')
}
function isElement(element) {
  if (!element) return false
  return Boolean((element.sessionId && element.value && element.value.ELEMENT) || element.ELEMENT)
}
function isSelector(selector) {
  if (!selector) return false
  return TypeUtils.isString(selector)
}
//function transformDriver(driver) {
//  const {CommandName} = require('protractor')
//
//  CommandName.SWITCH_TO_PARENT_FRAME = 'switchToParentFrame'
//  driver
//    .getExecutor()
//    .defineCommand(CommandName.SWITCH_TO_PARENT_FRAME, 'POST', '/session/:sessionId/frame/parent')
//  return driver
//}
//function transformElement(element) {
//  if (TypeUtils.instanceOf(element, 'ElementFinder')) {
//    return element.getWebElement()
//  }
//  return element
//}
//function isStaleElementError(error) {
//  if (!error) return false
//  error = error.originalError || error
//  return error instanceof Error && error.name === 'StaleElementReferenceError'
//}
function isEqualElements(_driver, element1, element2) {
  if (!element1 || !element2) return false
  const elementId1 = extractElementId(element1)
  const elementId2 = extractElementId(element2)
  return Boolean(elementId1 === elementId2)
}
//
//// #endregion
//
//// #region COMMANDS
//
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
  const frameId = await getFrameId(driver, element)
  await driver.frame(frameId)
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
//async function getElementRect(_driver, element) {
//  const {x, y} = await element.getLocation()
//  const {width, height} = await element.getSize()
//  return {x, y, width, height}
//}
//async function getWindowRect(driver) {
//  const {x, y} = await driver
//    .manage()
//    .window()
//    .getPosition()
//  const {width, height} = await driver
//    .manage()
//    .window()
//    .getSize()
//  return {x, y, width, height}
//}
//async function setWindowRect(driver, rect = {}) {
//  const {x = null, y = null, width = null, height = null} = rect
//  if (x !== null && y !== null) {
//    await driver
//      .manage()
//      .window()
//      .setPosition(x, y)
//  }
//  if (width !== null && height !== null) {
//    await driver
//      .manage()
//      .window()
//      .setSize(width, height)
//  }
//}
//async function getOrientation(driver) {
//  const capabilities = await driver.getCapabilities()
//  const orientation = capabilities.get('orientation') || capabilities.get('deviceOrientation')
//  return orientation.toLowerCase()
//}
function getDriverInfo(driver) {
  return {sessionId: driver.sessionId}
  //const capabilities = await driver.getCapabilities()
  //const session = await driver.getSession()
  //const sessionId = session.getId()
  //const deviceName = capabilities.has('desired')
  //  ? capabilities.get('desired').deviceName
  //  : capabilities.get('deviceName')
  //const platformName = capabilities.get('platformName') || capabilities.get('platform')
  //const platformVersion = capabilities.get('platformVersion')
  //const browserName = capabilities.get('browserName')
  //const browserVersion = capabilities.get('browserVersion')
  //const isMobile = ['android', 'ios'].includes(platformName && platformName.toLowerCase())
  //return {
  //  sessionId,
  //  isMobile,
  //  isNative: isMobile && !browserName,
  //  deviceName,
  //  platformName,
  //  platformVersion,
  //  browserName,
  //  browserVersion,
  //}
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
//async function takeScreenshot(driver) {
//  return driver.takeScreenshot()
//}
//async function click(driver, element) {
//  if (isSelector(element)) {
//    element = await findElement(driver, element)
//  }
//  return element.click()
//}
//async function type(driver, element, keys) {
//  if (isSelector(element)) {
//    element = await findElement(driver, element)
//  }
//  return element.sendKeys(keys)
//}
//async function waitUntilDisplayed(driver, selector, timeout) {
//  const {until} = require('protractor')
//
//  const element = await findElement(driver, selector)
//  return driver.wait(until.elementIsVisible(element), timeout)
//}
//async function scrollIntoView(driver, element, align = false) {
//  if (isSelector(element)) {
//    element = await findElement(driver, element)
//  }
//  await driver.executeScript('arguments[0].scrollIntoView(arguments[1])', element, align)
//}
//async function hover(driver, element, {x, y} = {}) {
//  if (isSelector(element)) {
//    element = await findElement(driver, element)
//  }
//  await driver
//    .actions()
//    .mouseMove(element, {x, y})
//    .perform()
//}
//
//// #endregion
//
//// #region TESTING
//
//const browserOptionsNames = {
//  chrome: 'goog:chromeOptions',
//  firefox: 'moz:firefoxOptions',
//}
//
//// #endregion
//
exports.isDriver = isDriver
exports.isElement = isElement
exports.isSelector = isSelector
//exports.transformDriver = transformDriver
//exports.transformElement = transformElement
exports.isEqualElements = isEqualElements
//exports.isStaleElementError = isStaleElementError
//
exports.executeScript = executeScript
exports.mainContext = mainContext
exports.parentContext = parentContext
exports.childContext = childContext
exports.findElement = findElement
exports.findElements = findElements
//exports.getElementRect = getElementRect
//exports.getWindowRect = getWindowRect
//exports.setWindowRect = setWindowRect
//exports.getOrientation = getOrientation
exports.getDriverInfo = getDriverInfo
exports.getTitle = getTitle
exports.getUrl = getUrl
exports.visit = visit
//exports.takeScreenshot = takeScreenshot
//exports.click = click
//exports.type = type
//exports.waitUntilDisplayed = waitUntilDisplayed
//exports.scrollIntoView = scrollIntoView
//exports.hover = hover
//
// no-op for generic tests
exports.build = () => {
  return [{}, () => {}]
}
