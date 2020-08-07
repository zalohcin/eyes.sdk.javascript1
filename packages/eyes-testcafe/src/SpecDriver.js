const {TypeUtils} = require('@applitools/eyes-sdk-core')

async function isDriver(driver) {
  return TypeUtils.instanceOf(driver, 'TestCafe') // TODO: confirm this
}
async function isElement(_element) {
  // TBD
}
async function isSelector(_selector) {
  // TBD
}
async function toEyesSelector(_selector) {}
async function isEqualElements(_driver, _element1, _element2) {}
async function isStaleElementError(_error) {
  // supposedly not a thing in TestCafe
  // https://codecept.io/testcafe/
  // haven't found anything about it in the TestCafe docs/KB
  return false
  // TODO: confirm
}
async function executeScript(_driver, _script, ..._args) {
  // TODO: ClientFunction
  // also needs the test context, which is the driver
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
  // not sure how to do this atm
  // TODO: research
}
async function getElementRect(_driver, _element) {}
async function getViewportSize(_driver) {
  // this is involved, if we're using the previous approach
  // TODO: review previous approaches further
}
async function setViewportSize(_driver, _size) {
  // this is involved, if we're using the previous approach
  // TODO: review previous approaches further
}
async function getTitle(_driver) {
  // accessible through a Selector
  // https://testcafe-discuss.devexpress.com/t/how-to-check-a-page-title/1233/5
}
async function getUrl(_driver) {
  // accessible through a ClientFunction
  // https://testcafe-discuss.devexpress.com/t/how-do-you-validate-url-in-testcafe/640
  // TODO: wire it up
}
async function visit(driver, url) {
  await driver.navigateTo(url)
}
async function takeScreenshot(driver) {
  // https://devexpress.github.io/testcafe/documentation/guides/advanced-guides/screenshots-and-videos.html#screenshots
  await driver.takeScreenshot()
}
async function click(driver, element) {
  // need a better understanding of what 'element' is in this context
  // https://devexpress.github.io/testcafe/documentation/reference/test-api/testcontroller/click.html#select-target-elements
  await driver.click(element)
}
async function type(driver, element, keys) {
  // NOTE: there are add'l options if we wnat them
  // https://devexpress.github.io/testcafe/documentation/reference/test-api/testcontroller/typetext.html
  await driver.typeText(element, keys)
}
async function waitUntilDisplayed(_driver, element, timeout) {
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
exports.getViewportSize = getViewportSize
exports.setViewportSize = setViewportSize
exports.getTitle = getTitle
exports.getUrl = getUrl
exports.visit = visit
exports.takeScreenshot = takeScreenshot
exports.click = click
exports.type = type
exports.waitUntilDisplayed = waitUntilDisplayed
exports.build = build
exports.cleanup = cleanup
