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
  return Object.values(_element)[0]
}
async function getFrameId(driver, element) {
  const name = await driver.elementIdAttribute(extractElementId(element), 'name')
  if (name) return name.value
  const id = await driver.elementIdAttribute(extractElementId(element), 'id')
  if (id) return id.value
}
function getCapabilities(driver, opts) {
  if (opts.returnFake) {
    const fake = {
      platform: 'ANDROID',
      automationName: 'UiAutomator2',
      platformName: 'Android',
      osVersion: '9.0',
      device: 'google pixel 2',
      browserstack: '{"appiumVersion"=>"1.17.0"}',
      'bstack:options': {local: false},
      chromeOptions: {args: ['--headless'], w3c: false},
      acceptSslCert: false,
      detected_language: 'nightwatch.js/1.3.4 (mac)',
      new_bucketing: true,
      os_version: '9.0',
      browser_name: 'chrome',
      deviceName: 'Android',
      sessionName: 'spec driver',
      buildName: 'nightwatch-test-build',
      'browserstack.minOSVersion': '4.1',
      appPackage: 'com.applitools.eyes.android',
      appActivity: 'com.applitools.eyes.android.activity.StartActivity',
      bundleID: 'com.applitools.eyes.android',
      bundleId: 'com.applitools.eyes.android',
      nativeWebScreenshot: true,
      version: '',
      mobile: {browser: 'mobile', version: 'Google Pixel 2-9.0'},
      orig_os: 'android',
      '64bit': false,
      udid: 'HT79V1A01893',
      adbExecTimeout: 120000,
      uiautomator2ServerLaunchTimeout: 60000,
      newCommandTimeout: 0,
      realMobile: 'true',
      acceptSslCerts: false,
      enablePerformanceLogging: false,
      systemPort: 8203,
    }
    return fake
  }
  return driver.capabilities
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
exports.getWindowRect = getWindowRect
exports.setWindowRect = setWindowRect
exports.getOrientation = getOrientation
exports.getDriverInfo = getDriverInfo
exports.getTitle = getTitle
exports.getUrl = getUrl
exports.visit = visit
exports.takeScreenshot = takeScreenshot
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
