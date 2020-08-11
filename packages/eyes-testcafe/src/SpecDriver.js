const {TypeUtils} = require('@applitools/eyes-sdk-core')
const {ClientFunction, _Selector} = require('testcafe')

// helpers
function _extractSelectorString(selector) {
  const util = require('util')
  const internals = util.inspect(selector, true, 2).split(',') // inspect(object, showHidden, depth)
  const filteredInternals = internals.filter(line => line.includes('Selector('))
  const match = !!filteredInternals.length && filteredInternals[0].match(/\(['"](.*)['"]\)/)
  if (match && match.length) return match[1]
  else throw new Error('Unable to determine selector')
}
// end helpers

async function isDriver(driver) {
  return driver.constructor.name === 'TestController'
}
function isSelector(selector) {
  if (!selector || typeof selector === 'object') return false
  return (
    TypeUtils.isString(selector) ||
    (typeof selector === 'function' && selector.name && selector.name.includes('clientFunction'))
  )
}
async function isElement(element) {
  return typeof element === 'object' && !!element.boundingClientRect
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
async function executeScript(driver, script, ...args) {
  const dependencies = {}
  args.forEach((arg, index) => {
    dependencies[`arg${index}`] = arg
  })
  const snippet = `return (function() {${script}})(${Object.keys(dependencies).join(',')})`
  script = TypeUtils.isString(script) ? new Function(snippet) : script
  const executor = ClientFunction(script, {dependencies})
  executor.with({boundTestRun: driver})
  return executor()
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
  return await selector()
}
async function findElements(driver, selector) {
  const executor = ClientFunction(
    () => {
      // eslint-disable-next-line no-undef
      return document.querySelectorAll(selector)
    },
    {dependencies: selector},
  )
  executor.with({boundTestRun: driver})
  return await executor()
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
  // https://devexpress.github.io/testcafe/documentation/guides/advanced-guides/screenshots-and-videos.html#screenshot-options
  // https://devexpress.github.io/testcafe/documentation/reference/test-api/testcontroller/takescreenshot.html
  // https://github.com/applitools/eyes.sdk.javascript1/blob/master/packages/eyes-testcafe/lib/wrappers/EyesWebDriver.js#L264-L281
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
// TODO
// Determine if we need build & cleanup
async function build(_env) {
  // https://github.com/applitools/eyes.sdk.javascript1/blob/master/packages/eyes-testcafe/test/util/start-testcafe-in-mocha.js
  // we might want something short of this implementation ^
  // something that prepares the runner with the provided env
  // and delegates the rest to the caller
}
async function cleanup(_driver) {
  // see comments above
}

exports.isDriver = isDriver
exports.isSelector = isSelector
exports.isElement = isElement
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
