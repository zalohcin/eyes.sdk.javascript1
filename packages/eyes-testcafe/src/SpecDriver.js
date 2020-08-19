const {GeneralUtils, TypeUtils} = require('@applitools/eyes-sdk-core')
const {ClientFunction, Selector} = require('testcafe')
const path = require('path')
const fs = require('fs')
const rmrf = require('rimraf')

// helpers
function extractSelectorString(selector) {
  // NOTE:
  // We inspect the internals of the function and find/return the selector string used to create it.
  // It's possible that a DOM Node snapshot was passed in, if so, we wrap it in a Selector so we can
  // use this approach.
  selector = isTestCafeSelector(selector) ? selector : Selector(selector)
  const util = require('util')
  const internals = util.inspect(selector, true, 2).split(',') // inspect(object, showHidden, depth)
  const filteredInternals = internals.filter(line => line.includes('Selector('))
  const match = !!filteredInternals.length && filteredInternals[0].match(/\(['"](.*)['"]\)/)
  if (match && match.length) return match[1]
  else throw new Error('Unable to determine selector')
}
async function XPathSelector(selector, opts = {}) {
  const getElementsByXPath = Selector(xpath => {
    /* eslint-disable no-undef */
    const iterator = document.evaluate(
      xpath,
      document,
      null,
      XPathResult.UNORDERED_NODE_ITERATOR_TYPE,
      null,
    )
    /* eslint-enable */
    const items = []

    let item = iterator.iterateNext()

    while (item) {
      items.push(item)
      item = iterator.iterateNext()
    }

    return items
  })
  const result = await getElementsByXPath(selector)
  return Array.isArray(result) && opts.findAll ? result : Selector(result)
}

function isEyesSelector(selector) {
  return TypeUtils.has(selector, ['type', 'selector'])
}
function isTestCafeSelector(selector) {
  return !!(selector && selector.addCustomMethods && selector.find && selector.parent)
}
function prepareArgsFunctionString(args) {
  // NOTE:
  // Objects/functions passed into a ClientFunction get transpiled into something that is difficult to understand.
  // We have significantly more knowledge of object/function contents/type before sending it into the ClientFunction.
  // We use this information to create a static function that will return a modified set of arguments
  // (to be run inside of the ClientFunction). It detects if a provided argument is a Selector function
  // and calls, otherwise, it will return the argument unchanged.
  return `return [
    ${args
      .map((arg, index) => {
        return isTestCafeSelector(arg) ? 'arguments[' + index + ']()' : 'arguments[' + index + ']'
      })
      .join(',\n    ')}
  ]`
}
function prepareClientFunction({clientFunction, dependencies, driver}) {
  const prepareArgs = new Function(prepareArgsFunctionString(dependencies.args))
  const executor = clientFunction(
    () => {
      /* eslint-disable no-undef */
      const EYES_NAME_SPACE = '__EYES__APPLITOOLS__'
      if (retrieveDomNodes) return window[EYES_NAME_SPACE].nodes
      const result = script(...prepareArgs(...args))
      const nodes = []
      let filteredResult
      const isDOMNode = obj => {
        return obj instanceof window.Node
      }
      if (isDOMNode(result)) {
        nodes.push(result)
      } else if (Array.isArray(result)) {
        filteredResult = result.map(entry => {
          if (isDOMNode(entry)) {
            nodes.push(entry)
            return {isDomNode: true}
          } else return entry
        })
      } else if (typeof result === 'object') {
        filteredResult = {}
        for (const [key, value] of window.Object.entries(result)) {
          if (isDOMNode(value)) {
            nodes.push(value)
            filteredResult[key] = {isDomNode: true}
          } else filteredResult[key] = value
        }
      }
      if (nodes && nodes.length) {
        if (!window[EYES_NAME_SPACE]) {
          window[EYES_NAME_SPACE] = {}
        }
        window[EYES_NAME_SPACE].nodes = nodes
        return {
          result: filteredResult,
          hasDomNodes: true,
        }
      }
      return {result, hasDomNodes: false}
      /* eslint-enable */
    },
    {dependencies: {prepareArgs, ...dependencies}},
  )
  executor.with({boundTestRun: driver})
  return executor
}
async function transformSelector(selector, opts = {}) {
  if (TypeUtils.isString(selector)) return Selector(selector)
  if (isEyesSelector(selector)) {
    if (selector.type === 'css') return Selector(selector.selector)
    else if (selector.type === 'xpath') return XPathSelector(selector.selector, opts)
  }
  return selector
}
// end helpers

function isDriver(driver) {
  return driver.constructor.name === 'TestController'
}
function isSelector(selector) {
  return TypeUtils.isString(selector) || isTestCafeSelector(selector)
}
function isElement(element) {
  return typeof element === 'object' && !!element.nodeType
}
function isEqualElements(_driver, element1, element2) {
  if (!element1 || !element2) return false
  // NOTE:
  // It's unclear of a better way to determine element identity.
  // Also, when looking up the same element twice, the second lookup does not
  // contain the `propType` property -- presumably a caching optimization.
  // To compensate we create normalized copies of the elements and do a
  // stringified comparison.
  const elements = [{...element1}, {...element2}].map(el => {
    delete el.propType
    return el
  })
  return JSON.stringify(elements[0]) === JSON.stringify(elements[1])
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
  const {result, hasDomNodes} = await executor()
  if (!hasDomNodes) return result

  // second pass (if a DOM Node element was found, need to retrieve it with a different executor)
  executor = prepareClientFunction({
    clientFunction: Selector,
    dependencies: {retrieveDomNodes: true, ...dependencies},
    driver,
  })
  const domNodes = await executor()

  // stitch the two results together, preserving the indended result from the provided script
  if (!result || !Object.keys(result).length) return domNodes
  if (Array.isArray(result)) {
    return result.map((entry, index) => {
      if (entry.isDomNode) {
        return domNodes.length ? domNodes[index] : domNodes
      } else return entry
    })
  }
  if (typeof result === 'object') {
    const r = {}
    Object.entries(result).forEach((entry, index) => {
      const key = entry[0]
      const value = entry[1]
      if (value.isDomNode) r[key] = domNodes.length ? domNodes[index] : domNodes
      else r[key] = value
    })
    return r
  }
}
async function mainContext(driver) {
  await driver.switchToMainWindow()
}
//async function parentContext(driver) {
// NOTE:
// Switching from the current browsing context up one-level is not built into TestCafe (yet).
// See the following for reference:
// - https://github.com/DevExpress/testcafe/issues/5429
// - https://stackoverflow.com/questions/63453228/how-to-traverse-a-nested-frame-tree-by-its-hierarchy-in-testcafe
// A workaround for this will be implemented in the core in order to minimize on the
// performance overhead needed to construct and walk through the frame tree in TestCafe.
//}
async function childContext(driver, element) {
  // NOTE:
  // The name of this function can be confusing out of context. This function is
  // just a wrapper for switchToIframe. It's used in concert with parentContext
  // in the core. parentContext is used to (implicitly) switch to the parent
  // frame. childContext is used to (explicitly) switch to the element provided
  // (it's assumed to be a child frame that is accessible from the current context).
  return await driver.switchToIframe(element)
}
async function findElement(_driver, selector) {
  selector = await transformSelector(selector)
  const elSnapshot = await selector()
  return elSnapshot ? elSnapshot.selector : undefined
}
async function findElements(driver, selector) {
  const transformedSelector = await transformSelector(selector, {findAll: true})
  debugger
  if (selector.type === 'xpath') return await transformedSelector()
  return await executeScript(
    driver,
    function() {
      // eslint-disable-next-line no-undef
      return document.querySelectorAll(arguments[0])
    },
    extractSelectorString(transformedSelector),
  )
}
async function getElementRect(_driver, _element) {}
// TODO: rollup getWindowRect & setWindowRect into snippets in core
async function getWindowRect(driver) {
  // NOTE: outerWidth & outerHeight return 0,0 when run headless (confirmed in Chrome)
  return await executeScript(
    driver,
    'return {width: window.outerWidth, height: window.outerHeight}',
  )
}
async function setWindowRect(driver, rect = {}) {
  const {width, height} = rect
  await driver.resizeWindow(width, height)
}
async function getTitle(_driver) {
  return await Selector('title').innerText
}
async function getUrl(driver) {
  return await executeScript(driver, 'return document.location.href')
}
async function visit(driver, url) {
  await driver.navigateTo(url)
}
async function takeScreenshot(driver, opts = {}) {
  // NOTE:
  // Since we are constrained to saving screenshots to disk, we place each screenshot in its own
  // dot-folder which has a GUID prefix (e.g., .applitools-guide/screenshot.png).
  // We then read the file from disk, return the buffer, and delete the folder.
  const SCREENSHOTS_PREFIX = '/.applitools'
  const SCREENSHOTS_FILENAME = 'screenshot.png'
  const filepath = path.resolve(
    `${SCREENSHOTS_PREFIX}-${GeneralUtils.guid()}`,
    SCREENSHOTS_FILENAME,
  )
  const screenshotPath = await driver.takeScreenshot(filepath)
  if (!screenshotPath) throw new Error('Unable to take screenshot')
  try {
    const screenshot = fs.readFileSync(screenshotPath)
    return opts.withMetadata ? {screenshot, screenshotPath} : screenshot
  } finally {
    const screenshotFolder = path.dirname(screenshotPath)
    rmrf.sync(screenshotFolder)
  }
}
async function click(driver, element) {
  // NOTE:
  // supposedly works with all options, e.g.,:
  // 1. selector string
  // 2. Selector object
  // 3. resolved Selector object (e.g., DOM Node snapshot/state)
  // https://devexpress.github.io/testcafe/documentation/reference/test-api/testcontroller/click.html#select-target-elements
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

exports.isDriver = isDriver
exports.isSelector = isSelector
exports.isElement = isElement
exports.isEqualElements = isEqualElements
exports.executeScript = executeScript
exports.mainContext = mainContext
//exports.parentContext = parentContext
exports.childContext = childContext
exports.findElement = findElement
exports.findElements = findElements
exports.getElementRect = getElementRect
exports.getWindowRect = getWindowRect
exports.setWindowRect = setWindowRect
exports.getTitle = getTitle
exports.getUrl = getUrl
exports.visit = visit
exports.takeScreenshot = takeScreenshot
exports.click = click
exports.type = type
exports.waitUntilDisplayed = waitUntilDisplayed
