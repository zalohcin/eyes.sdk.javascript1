async function getAbsoluteElementLocation({jsExecutor, element, logger}) {
  try {
    const elementRect = await _getElementRect({jsExecutor, element})
    const elementCoords = {x: Math.ceil(elementRect.x), y: Math.ceil(elementRect.y)}
    const elementIsInTopDocument = await _isElementInTopDocument(jsExecutor, element)
    if (elementIsInTopDocument) {
      return elementCoords
    } else {
      const frameCoords = await _getFrameCoordsToElement(jsExecutor, element)
      return _calculateNestedElementLocation({frameCoords, elementCoords})
    }
  } catch (error) {
    if (error.seleniumStack && error.seleniumStack.type === 'StaleElementReference') {
      throw error
    }
    if (error.message.includes('Blocked a frame with origin')) {
      const errorMessage = error.message.replace(/<unknown>: /, '')
      throw new Error(_concatenateLogMessage(errorMessage))
    }
    if (
      error.message.includes(`number or type of arguments don't agree`) ||
      error.message.includes(`getBoundingClientRect is not a function`)
    )
      throw new Error(_concatenateLogMessage('Invalid element provided'))
    logger.log(`WARNING - ${_concatenateLogMessage(error)}`)
  }
}

function _calculateNestedElementLocation({frameCoords, elementCoords}) {
  let elementLocation = {x: elementCoords.x, y: elementCoords.y}
  frameCoords.forEach(frameCoord => {
    elementLocation.x += Math.ceil(frameCoord.x)
    elementLocation.y += Math.ceil(frameCoord.y)
  })
  return elementLocation
}

function _concatenateLogMessage(message) {
  return `web-element-util.getAbsoluteElementLocation errored: ${message}`
}

async function _getElementRect({jsExecutor, element}) {
  const r = await jsExecutor(function(e) {
    const rect = e.getBoundingClientRect()
    return {
      x: rect.x !== undefined ? rect.x : rect.left,
      y: rect.y !== undefined ? rect.y : rect.top,
      height: rect.height,
      width: rect.width,
    }
  }, element)
  return r ? r.value : {}
}

async function _getFrameCoordsToElement(jsExecutor, element) {
  const r = await jsExecutor(function(e) {
    const frameCoords = []
    let targetDocument = e.ownerDocument
    // eslint-disable-next-line
    while (targetDocument !== window.top.document) {
      const frame = targetDocument.defaultView.frameElement
      const rect = frame.getBoundingClientRect()
      const safeRect = {
        x: rect.x !== undefined ? rect.x : rect.left,
        y: rect.y !== undefined ? rect.y : rect.top,
        height: rect.height,
        width: rect.width,
      }
      frameCoords.push(safeRect)
      targetDocument = frame.ownerDocument
    }
    return frameCoords
  }, element)
  return r && r.value ? r.value : []
}

async function _isElementInTopDocument(jsExecutor, element) {
  const r = await jsExecutor(function(e) {
    // eslint-disable-next-line no-undef
    return e.ownerDocument === window.top.document
  }, element)
  return r && r.value ? r.value : false
}

function isWDIOElement(object) {
  return object && object.ELEMENT
}

module.exports = {
  getAbsoluteElementLocation,
  isWDIOElement,
}
