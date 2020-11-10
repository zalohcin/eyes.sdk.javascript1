// #region HELPERS

async function handleToObject(handle) {
  const [_, type] = handle.toString().split('@')
  if (type === 'array') {
    const map = await handle.getProperties()
    return Promise.all(Array.from(map.values(), handleToObject))
  } else if (type === 'object') {
    const map = await handle.getProperties()
    const chunks = await Promise.all(
      Array.from(map, async ([key, handle]) => ({[key]: await handleToObject(handle)})),
    )
    return Object.assign(...chunks)
  } else if (type === 'node') {
    return handle.asElement()
  } else {
    return handle.jsonValue()
  }
}

function transformSelector(selector) {
  // if (TypeUtils.has(selector, ['type', 'selector'])) {
  if ('type' in selector) {
    if (selector.type === 'css') return `css=${selector.selector}`
    else if (selector.type === 'xpath') return `xpath=${selector.selector}`
  }
  return selector
}

function extractContext(page) {
  return page.constructor.name === 'Page' ? page.mainFrame() : page
}

// #endregion

// #region COMMANDS
async function isEqualElements(frame, element1, element2) {
  return frame
    .evaluate(([element1, element2]) => element1 === element2, [element1, element2])
    .catch(() => false)
}
async function executeScript(frame, script, arg) {
  const result = await frame.evaluateHandle(new Function(script), arg)
  return handleToObject(result)
}
async function mainContext(frame) {
  frame = extractContext(frame)
  let mainFrame = frame
  while (mainFrame.parentFrame()) {
    mainFrame = mainFrame.parentFrame()
  }
  return mainFrame
}
async function parentContext(frame) {
  frame = extractContext(frame)
  return frame.parentFrame()
}
async function childContext(_frame, element) {
  return element.contentFrame()
}
async function findElement(frame, selector) {
  return frame.$(transformSelector(selector))
}
async function findElements(frame, selector) {
  return frame.$$(transformSelector(selector))
}
async function getViewportSize(page) {
  return page.viewportSize()
}
async function setViewportSize(page, size = {}) {
  return page.setViewportSize(size)
}
async function getTitle(page) {
  return page.title()
}
async function getUrl(page) {
  return page.url()
}
async function getDriverInfo(_page) {
  return {}
}
async function takeScreenshot(page) {
  return page.screenshot()
}

// #endregion

exports.isEqualElements = isEqualElements
exports.executeScript = executeScript
exports.mainContext = mainContext
exports.parentContext = parentContext
exports.childContext = childContext
exports.findElement = findElement
exports.findElements = findElements
exports.getViewportSize = getViewportSize
exports.setViewportSize = setViewportSize
exports.getTitle = getTitle
exports.getUrl = getUrl
exports.getDriverInfo = getDriverInfo
exports.takeScreenshot = takeScreenshot
