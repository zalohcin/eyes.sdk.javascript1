const {TypeUtils} = require('@applitools/eyes-sdk-core')
const {ClientFunction, Selector} = require('testcafe')

// helpers
function isTestCafeSelector(selector) {
  // return !!(typeof selector === 'function' && selector.name && selector.name.includes('clientFunction'))
  return !!(selector && selector.addCustomMethods && selector.find && selector.parent)
}
function prepareClientFunction({clientFunction, dependencies, driver}) {
  const executor = clientFunction(
    () => {
      /* eslint-disable no-undef */
      const EYES_NAME_SPACE = '__EYES__APPLITOOLS__'
      if (retrieveDomNodes) return window[EYES_NAME_SPACE].nodes
      const manipulatedArgs = args.map(arg => {
        return typeof arg === 'function' ? arg() : arg
      })
      const result = script(...manipulatedArgs)
      const nodes = []
      const filteredResult = []
      const isDOMNode = obj => {
        return obj instanceof window.Node
      }
      if (isDOMNode(result)) nodes.push(result)
      else if (Array.isArray(result)) {
        result.forEach(entry => {
          if (isDOMNode(entry)) nodes.push(entry)
          else filteredResult.push(entry)
        })
      } else if (typeof result === 'object') {
        for (const [key, value] of window.Object.entries(result)) {
          if (isDOMNode(value)) {
            nodes.push(value)
            filteredResult.push({[key]: {isDomNode: true}})
          } else filteredResult.push({[key]: value})
        }
      }
      if (nodes && nodes.length) {
        if (!window[EYES_NAME_SPACE]) {
          window[EYES_NAME_SPACE] = {}
        }
        window[EYES_NAME_SPACE].nodes = nodes
        return {
          hasDomNodes: true,
          filteredResult,
          metadata: {
            isArray: Array.isArray(result),
            type: typeof result,
          },
        }
      }
      return result
      /* eslint-enable */
    },
    {dependencies},
  )
  executor.with({boundTestRun: driver})
  return executor
}
// end helpers

// TODO: add element comparison function (important)

async function isDriver(driver) {
  return driver.constructor.name === 'TestController'
}
function isSelector(selector) {
  return TypeUtils.isString(selector) || isTestCafeSelector(selector)
}
async function isElement(element) {
  return typeof element === 'object' && !!element.boundingClientRect
}
async function isEqualElements(_driver, _element1, _element2) {
  // TODO
}
async function executeScript(driver, script, ...args) {
  script = TypeUtils.isString(script) ? new Function(script) : script
  const dependencies = {script, args}
  let executor

  // first pass (covers most cases)
  executor = prepareClientFunction({
    clientFunction: ClientFunction,
    dependencies: {retrieveDomNodes: false, ...dependencies},
    driver,
  })
  const firstResult = await executor()
  if (!firstResult || !firstResult.hasDomNodes) return firstResult

  // second pass (if a DOM Node element was found, need to retrieve it with a different executor)
  executor = prepareClientFunction({
    clientFunction: Selector,
    dependencies: {retrieveDomNodes: true, ...dependencies},
    driver,
  })
  const secondResult = await executor()

  // stitch the two results together, preserving the indended result from the provided script
  if (!firstResult.filteredResult.length) return secondResult
  if (firstResult.metadata.isArray) {
    return secondResult && !secondResult.length
      ? [...firstResult.filteredResult, secondResult]
      : [...firstResult.filteredResult, ...secondResult]
  }
  if (firstResult.metadata.type === 'object') {
    const result = {}
    firstResult.filteredResult.forEach((entry, index) => {
      for (const [key, value] of Object.entries(entry)) {
        if (value.isDomNode) result[key] = secondResult.length ? secondResult[index] : secondResult
        else result[key] = value
      }
    })
    return result
  }
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
  const executor = Selector(
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
