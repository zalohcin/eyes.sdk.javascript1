const {TypeUtils} = require('@applitools/eyes-sdk-core')
const {Builder, Runner, Command, CommandName, until} = require('protractor')

// #region HELPERS

const byHash = [
  'className',
  'css',
  'id',
  'js',
  'linkText',
  'name',
  'partialLinkText',
  'tagName',
  'xpath',
]

function extractElementId(element) {
  return element.getId()
}

function transformSelector(selector) {
  if (TypeUtils.has(selector, ['type', 'selector'])) {
    if (selector.type === 'css') return {css: selector.selector}
    else if (selector.type === 'xpath') return {xpath: selector.selector}
  }
  return selector
}

// #endregion

// #region UTILITY

function isDriver(driver) {
  return TypeUtils.instanceOf(driver, 'ProtractorBrowser')
}
function isElement(element) {
  return (
    TypeUtils.instanceOf(element, 'WebElement') || TypeUtils.instanceOf(element, 'ElementFinder')
  )
}
function isSelector(selector) {
  if (!selector) return false
  return (
    TypeUtils.isString(selector) ||
    TypeUtils.has(selector, ['type', 'selector']) ||
    TypeUtils.has(selector, ['using', 'value']) ||
    Object.keys(selector).some(key => byHash.includes(key)) ||
    TypeUtils.isFunction(selector.findElementsOverride)
  )
}
function transformDriver(driver) {
  CommandName.SWITCH_TO_PARENT_FRAME = 'switchToParentFrame'
  driver
    .getExecutor()
    .defineCommand(CommandName.SWITCH_TO_PARENT_FRAME, 'POST', '/session/:sessionId/frame/parent')
  return driver
}
function transformElement(element) {
  if (TypeUtils.instanceOf(element, 'ElementFinder')) {
    return element.getWebElement()
  }
  return element
}
function isStaleElementError(error) {
  if (!error) return false
  error = error.originalError || error
  return error instanceof Error && error.name === 'StaleElementReferenceError'
}
async function isEqualElements(_driver, element1, element2) {
  if (!element1 || !element2) return false
  const elementId1 = await extractElementId(element1)
  const elementId2 = await extractElementId(element2)
  return elementId1 === elementId2
}

// #endregion

// #region COMMANDS

async function executeScript(driver, script, ...args) {
  return driver.executeScript(script, ...args)
}
async function mainContext(driver) {
  await driver.switchTo().defaultContent()
  return driver
}
async function parentContext(driver) {
  await driver.schedule(new Command(CommandName.SWITCH_TO_PARENT_FRAME))
  return driver
}
async function childContext(driver, element) {
  await driver.switchTo().frame(element)
  return driver
}
async function findElement(driver, selector) {
  try {
    if (TypeUtils.isString(selector)) selector = {css: selector}
    const element = await driver.findElement(transformSelector(selector))
    return element
  } catch (err) {
    if (err.name === 'NoSuchElementError') return null
    else throw err
  }
}
async function findElements(driver, selector) {
  if (TypeUtils.isString(selector)) selector = {css: selector}
  const elements = await driver.findElements(transformSelector(selector))
  return elements
}
async function getElementRect(_driver, element) {
  const {x, y} = await element.getLocation()
  const {width, height} = await element.getSize()
  return {x, y, width, height}
}
async function getWindowRect(driver) {
  const {x, y} = await driver
    .manage()
    .window()
    .getPosition()
  const {width, height} = await driver
    .manage()
    .window()
    .getSize()
  return {x, y, width, height}
}
async function setWindowRect(driver, rect = {}) {
  const {x = null, y = null, width = null, height = null} = rect
  if (x !== null && y !== null) {
    await driver
      .manage()
      .window()
      .setPosition(x, y)
  }
  if (width !== null && height !== null) {
    await driver
      .manage()
      .window()
      .setSize(width, height)
  }
}
async function getOrientation(driver) {
  const capabilities = await driver.getCapabilities()
  const orientation = capabilities.get('orientation') || capabilities.get('deviceOrientation')
  return orientation.toLowerCase()
}
async function isMobile(driver) {
  const capabilities = await driver.getCapabilities()
  const platformName = capabilities.get('platformName')
  return platformName ? ['android', 'ios'].includes(platformName.toLowerCase()) : false
}
async function isNative(driver) {
  const capabilities = await driver.getCapabilities()
  const platformName = capabilities.get('platformName')
  const browserName = capabilities.get('browserName')
  return platformName
    ? ['android', 'ios'].includes(platformName.toLowerCase()) && !browserName
    : false
}
async function getDeviceName(driver) {
  const capabilities = await driver.getCapabilities()
  return capabilities.has('desired')
    ? capabilities.get('desired').deviceName
    : capabilities.get('deviceName')
}
async function getPlatformName(driver) {
  const capabilities = await driver.getCapabilities()
  return capabilities.get('platformName')
}
async function getPlatformVersion(driver) {
  const capabilities = await driver.getCapabilities()
  return capabilities.get('platformVersion')
}
async function getBrowserName(driver) {
  const capabilities = await driver.getCapabilities()
  return capabilities.get('browserName')
}
async function getBrowserVersion(driver) {
  const capabilities = await driver.getCapabilities()
  return capabilities.get('browserVersion')
}
async function getSessionId(driver) {
  const session = await driver.getSession()
  return session.getId()
}
async function getTitle(driver) {
  return driver.getTitle()
}
async function getUrl(driver) {
  return driver.getCurrentUrl()
}
async function visit(driver, url) {
  return driver.get(url)
}
async function takeScreenshot(driver) {
  return driver.takeScreenshot()
}
async function click(driver, element) {
  if (isSelector(element)) {
    element = await findElement(driver, element)
  }
  return element.click()
}
async function type(driver, element, keys) {
  if (isSelector(element)) {
    element = await findElement(driver, element)
  }
  return element.sendKeys(keys)
}
async function waitUntilDisplayed(driver, selector, timeout) {
  const element = await findElement(driver, selector)
  return driver.wait(until.elementIsVisible(element), timeout)
}
async function scrollIntoView(driver, element, align = false) {
  if (isSelector(element)) {
    element = await findElement(driver, element)
  }
  await driver.executeScript('arguments[0].scrollIntoView(arguments[1])', element, align)
}
async function hover(driver, element, {x, y} = {}) {
  if (isSelector(element)) {
    element = await findElement(driver, element)
  }
  await driver
    .actions()
    .mouseMove(element, {x, y})
    .perform()
}

// #endregion

// #region TESTING

const browserOptionsNames = {
  chrome: 'goog:chromeOptions',
  firefox: 'moz:firefoxOptions',
}
async function build(env) {
  const {testSetup} = require('@applitools/sdk-shared')
  const {
    browser = '',
    capabilities,
    headless,
    url,
    args = [],
    logLevel = 'silent',
  } = testSetup.Env({...env, legacy: true})

  const desiredCapabilities = {browserName: browser, ...capabilities}
  const browserOptionsName = browserOptionsNames[browser]
  if (browserOptionsName) {
    desiredCapabilities[browserOptionsName] = {
      args: headless ? args.concat('headless') : args,
    }
  }
  const seleniumWebDriver = new Builder()
    .withCapabilities(desiredCapabilities)
    .usingServer(url.href)
    .build()
  const runner = new Runner({
    seleniumWebDriver,
    logLevel: logLevel.toUpperCase(),
    allScriptsTimeout: 60000,
    getPageTimeout: 10000,
  })
  const driver = await runner.createBrowser().ready
  driver.by = driver.constructor.By
  driver.waitForAngularEnabled(false)
  return [driver, () => driver.quit()]
}

// #endregion

exports.isDriver = isDriver
exports.isElement = isElement
exports.isSelector = isSelector
exports.transformDriver = transformDriver
exports.transformElement = transformElement
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
exports.isMobile = isMobile
exports.isNative = isNative
exports.getDeviceName = getDeviceName
exports.getPlatformName = getPlatformName
exports.getPlatformVersion = getPlatformVersion
exports.getBrowserName = getBrowserName
exports.getBrowserVersion = getBrowserVersion
exports.getSessionId = getSessionId
exports.getTitle = getTitle
exports.getUrl = getUrl
exports.visit = visit
exports.takeScreenshot = takeScreenshot
exports.click = click
exports.type = type
exports.waitUntilDisplayed = waitUntilDisplayed
exports.scrollIntoView = scrollIntoView
exports.hover = hover

exports.build = build
