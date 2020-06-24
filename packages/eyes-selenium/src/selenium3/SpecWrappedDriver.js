const TypeUtils = require('@applitools/eyes-sdk-core')
const {By, Builder, until} = require('selenium-webdriver')
const cmd = require('selenium-webdriver/lib/command')
const SeleniumFrame = require('../SeleniumFrame')
const SeleniumWrappedElement = require('../SeleniumWrappedElement')

/**
 * @typedef {import('selenium-webdriver').WebDriver} Driver
 */

function isEqualFrames(leftFrame, rightFrame) {
  return SeleniumFrame.equals(leftFrame, rightFrame)
}

function createFrameReference(reference) {
  return SeleniumFrame.fromReference(reference)
}

function createElement(logger, driver, element, selector) {
  return new SeleniumWrappedElement(logger, driver, element, selector)
}

function toSupportedSelector(selector) {
  return SeleniumWrappedElement.toSupportedSelector(selector)
}

function toEyesSelector(selector) {
  return SeleniumWrappedElement.toEyesSelector(selector)
}

function prepareDriver(driver) {
  cmd.Name.SWITCH_TO_PARENT_FRAME = 'switchToParentFrame'
  driver
    .getExecutor()
    .defineCommand(cmd.Name.SWITCH_TO_PARENT_FRAME, 'POST', '/session/:sessionId/frame/parent')
  return driver
}

async function executeScript(driver, script, ...args) {
  return driver.executeScript(script, ...args)
}

async function sleep(driver, ms) {
  return driver.sleep(ms)
}

async function switchToFrame(driver, reference) {
  return driver.switchTo().frame(reference)
}

async function switchToParentFrame(driver) {
  return driver.schedule(new cmd.Command(cmd.Name.SWITCH_TO_PARENT_FRAME))
}

async function findElement(driver, selector) {
  try {
    if (TypeUtils.isString(selector)) {
      selector = By.css(selector)
    }
    return await driver.findElement(selector)
  } catch (err) {
    if (err.name === 'NoSuchElementError') return null
    else throw err
  }
}

async function findElements(driver, selector) {
  if (TypeUtils.isString(selector)) {
    selector = By.css(selector)
  }
  return driver.findElements(selector)
}

async function getWindowLocation(driver) {
  const {x, y} = await driver
    .manage()
    .window()
    .getPosition()
  return {x, y}
}

async function setWindowLocation(driver, location) {
  await driver
    .manage()
    .window()
    .setPosition(location.x, location.y)
}

async function getWindowSize(driver) {
  try {
    const {width, height} = await driver
      .manage()
      .window()
      .getSize()
    return {width, height}
  } catch (err) {
    // workaround for Appium
    return driver.execute(
      new cmd.Command(cmd.Name.GET_WINDOW_SIZE).setParameter('windowHandle', 'current'),
    )
  }
}

async function setWindowSize(driver, size) {
  await driver
    .manage()
    .window()
    .setSize(size.width, size.height)
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

async function isAndroid(driver) {
  const capabilities = await driver.getCapabilities()
  const platformName = capabilities.get('platformName')
  return platformName ? platformName.toLowerCase() === 'android' : false
}

async function isIOS(driver) {
  const capabilities = await driver.getCapabilities()
  const platformName = capabilities.get('platformName')
  return platformName ? platformName.toLowerCase() === 'ios' : false
}

async function isNative(driver) {
  const capabilities = await driver.getCapabilities()
  const platformName = capabilities.get('platformName')
  const browserName = capabilities.get('browserName')
  return platformName
    ? ['android', 'ios'].includes(platformName.toLowerCase()) && !browserName
    : false
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

async function takeScreenshot(driver) {
  return driver.takeScreenshot()
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

/* -------- FOR TESTING PURPOSES -------- */

async function build({capabilities, serverUrl = process.env.CVG_TESTS_REMOTE}) {
  if (capabilities['sauce:options']) {
    capabilities.username = capabilities['sauce:options'].username
    capabilities.accesskey = capabilities['sauce:options'].accesskey
  }
  return new Builder()
    .withCapabilities(capabilities)
    .usingServer(serverUrl)
    .build()
}

async function cleanup(driver) {
  return driver.quit()
}

async function click(driver, el) {
  if (TypeUtils.isString(el)) {
    el = await findElement(driver, el)
  }
  return el.click()
}

async function type(_driver, el, keys) {
  return el.sendKeys(keys)
}

async function waitUntilDisplayed(driver, selector, timeout) {
  const el = await findElement(driver, selector)
  return driver.wait(until.elementIsVisible(el), timeout)
}

async function getElementRect(_driver, element) {
  const location = await element.getLocation()
  const size = await element.getSize()
  return {...size, ...location}
}

exports.isEqualFrames = isEqualFrames
exports.createFrameReference = createFrameReference
exports.createElement = createElement
exports.toSupportedSelector = toSupportedSelector
exports.toEyesSelector = toEyesSelector
exports.prepareDriver = prepareDriver
exports.executeScript = executeScript
exports.sleep = sleep
exports.switchToFrame = switchToFrame
exports.switchToParentFrame = switchToParentFrame
exports.findElement = findElement
exports.findElements = findElements
exports.getWindowLocation = getWindowLocation
exports.setWindowLocation = setWindowLocation
exports.getWindowSize = getWindowSize
exports.setWindowSize = setWindowSize
exports.getOrientation = getOrientation
exports.isMobile = isMobile
exports.isAndroid = isAndroid
exports.isIOS = isIOS
exports.isNative = isNative
exports.getPlatformVersion = getPlatformVersion
exports.getBrowserName = getBrowserName
exports.getBrowserVersion = getBrowserVersion
exports.getSessionId = getSessionId
exports.takeScreenshot = takeScreenshot
exports.getTitle = getTitle
exports.getUrl = getUrl
exports.visit = visit
exports.build = build
exports.cleanup = cleanup
exports.click = click
exports.type = type
exports.waitUntilDisplayed = waitUntilDisplayed
exports.getElementRect = getElementRect
