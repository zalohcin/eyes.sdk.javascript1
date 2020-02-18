async function getElementLocation({driver, element, logger}) {
  try {
    const elementRect = await driver.elementIdRect(element.ELEMENT)
    const elementCoords = {x: Math.ceil(elementRect.value.x), y: Math.ceil(elementRect.value.y)}
    const elementIsInTopDocument = await _isElementInTopDocument(driver, element)
    if (elementIsInTopDocument) {
      return elementCoords
    } else {
      const frameCoords = await _getFrameCoordsToElement(driver, element)
      return _calculateNestedElementLocation({frameCoords, elementCoords})
    }
  } catch (error) {
    if (error.message.includes('Blocked a frame with origin')) {
      const errorMessage = error.message.replace(/<unknown>: /, '')
      throw new Error(`web-element-util.getElementLocation errored: ${errorMessage}`)
    }
    if (error.message.includes(`number or type of arguments don't agree`))
      throw new Error('web-element-util.getElementLocation errored: Invalid element provided')
    logger.log(`WARNING - web-element-util.getElementLocation errored: ${error}`)
  }
}

async function _isElementInTopDocument(driver, element) {
  const r = await driver.execute(_element => {
    // eslint-disable-next-line
    return _element.ownerDocument === window.top.document
  }, element)
  return r && r.value ? r.value : false
}

async function _getFrameCoordsToElement(driver, element) {
  const r = await driver.execute(_element => {
    const frameCoords = []
    // eslint-disable-next-line
    let targetDocument = _element.ownerDocument
    // eslint-disable-next-line
    while (targetDocument !== window.top.document) {
      const frame = targetDocument.defaultView.frameElement
      frameCoords.push(frame.getBoundingClientRect())
      targetDocument = frame.ownerDocument
    }
    return frameCoords
  }, element)
  return r && r.value ? r.value : []
}

function _calculateNestedElementLocation({frameCoords, elementCoords}) {
  let elementLocation = {x: elementCoords.x, y: elementCoords.y}
  frameCoords.forEach(frameCoord => {
    elementLocation.x += Math.ceil(frameCoord.x)
    elementLocation.y += Math.ceil(frameCoord.y)
  })
  return elementLocation
}

module.exports = {
  getElementLocation,
}
