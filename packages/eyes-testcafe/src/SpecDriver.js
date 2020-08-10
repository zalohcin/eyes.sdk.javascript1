const {TypeUtils} = require('@applitools/eyes-sdk-core')

async function isDriver(driver) {
  // TODO: confirm this
  return TypeUtils.instanceOf(driver, 'TestCafe')
}
async function isElement(_element) {
  // TODO: determine way to identify a resolved Selector
  // - DOMNodeState? https://devexpress.github.io/testcafe/documentation/reference/test-api/domnodestate.html
}
async function isSelector(_selector) {
  // TODO:
  // - if string, true
  // - else if Selector object, true
  // - else false
}
async function toEyesSelector(_selector) {
  // TODO:
  // - parse out selector string value
  // - convert to object structure:
  //  selector -> {type: 'css' | 'xpath', selector: string}
  // - return {selector}
}
async function isEqualElements(_driver, _element1, _element2) {
  // TODO
}
async function isStaleElementError(_error) {
  // TODO: confirm, but
  // supposedly not a thing in TestCafe
  // https://codecept.io/testcafe/
  // haven't found anything about it in the TestCafe docs/KB
  return false
}
async function executeScript(_driver, _script, ..._args) {
  // TODO: ClientFunction
}
async function mainContext(driver) {
  await driver.switchToMainWindow()
}
async function parentContext(driver) {
  await driver.switchToParentWindow()
}
async function childContext(_driver, element) {
  return element.child()
}
async function findElement(_driver, selector) {
  return await selector
}
async function findElements(_driver, _selector) {
  // TODO: ClientFunction w/ document.querySelectorAll, return array of what's resolved
}
async function getElementRect(_driver, _element) {}
async function setWindowRect(driver, rect = {}) {
  const {width, height} = rect
  await driver.resizeWindow(width, height)
}
async function getTitle(_driver) {
  // TODO:
  // accessible through a ClientFunction
}
async function getUrl(_driver) {
  // TODO:
  // accessible through a ClientFunction
  // https://testcafe-discuss.devexpress.com/t/how-do-you-validate-url-in-testcafe/640
}
async function visit(driver, url) {
  await driver.navigateTo(url)
}
async function takeScreenshot(driver) {
  // TODO: sort out what this function give us
  // and what's needed to consume/use it (e.g., read file from disk? etc.)
  // https://devexpress.github.io/testcafe/documentation/guides/advanced-guides/screenshots-and-videos.html#screenshots
  await driver.takeScreenshot()
}
async function click(driver, element) {
  // NOTE:
  // supposedly works with all options, e.g.,:
  // 1. selector string
  // 2. Selector object
  // 3. resolved Selector object (e.g., DOM Node snapshot/state)
  // 4. return from a ClientFunction that uses document.querySelector*
  // https://devexpress.github.io/testcafe/documentation/reference/test-api/testcontroller/click.html#select-target-elements
  // My hunch is `element` most closely resembles #3, but we should be able to pass it and ¯\_(ツ)_/¯
  await driver.click(element)
}
async function type(driver, element, keys) {
  // NOTE: there are add'l options if we wnat them
  // https://devexpress.github.io/testcafe/documentation/reference/test-api/testcontroller/typetext.html
  await driver.typeText(element, keys)
}
async function waitUntilDisplayed(_driver, element, timeout) {
  // NOTE: documented here:
  // https://devexpress.github.io/testcafe/documentation/guides/concepts/built-in-wait-mechanisms.html#wait-mechanism-for-selectors
  await element.with({visibilityCheck: true, timeout})
}
async function build(_env) {
  // TODO
}
async function cleanup(_driver) {
  // TODO
}

exports.isDriver = isDriver
exports.isElement = isElement
exports.isSelector = isSelector
exports.toEyesSelector = toEyesSelector
exports.isEqualElements = isEqualElements
exports.isStaleElementError = isStaleElementError
exports.executeScript = executeScript
exports.mainContext = mainContext
exports.parentContext = parentContext
exports.childContext = childContext
exports.findElement = findElement
exports.findElements = findElements
exports.getElementRect = getElementRect
exports.setWindowRect = setWindowRect
exports.getTitle = getTitle
exports.getUrl = getUrl
exports.visit = visit
exports.takeScreenshot = takeScreenshot
exports.click = click
exports.type = type
exports.waitUntilDisplayed = waitUntilDisplayed
exports.build = build
exports.cleanup = cleanup
