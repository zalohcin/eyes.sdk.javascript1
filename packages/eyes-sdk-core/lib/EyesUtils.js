const {
  GeneralUtils,
  ArgumentGuard,
  Location,
  RectangleSize,
  Region,
  MutableImage,
  EyesError,
} = require('@applitools/eyes-common')
const {EyesDriverOperationError} = require('./errors/EyesDriverOperationError')
const EyesJsSnippets = require('./EyesJsSnippets')

async function getViewportSize(_logger, {executor}) {
  const [width, height] = await executor.executeScript(EyesJsSnippets.GET_VIEWPORT_SIZE)
  return new RectangleSize(Number.parseInt(width, 10) || 0, Number.parseInt(height, 10) || 0)
}

async function setViewportSize(logger, {controller, executor, context}, requiredViewportSize) {
  ArgumentGuard.notNull(requiredViewportSize, 'requiredViewportSize')
  // First we will set the window size to the required size.
  // Then we'll check the viewport size and increase the window size accordingly.
  logger.verbose(`setViewportSize(${requiredViewportSize})`)

  return context.framesSwitchAndReturn(null, async () => {
    let actualViewportSize = await getViewportSize(logger, {executor})
    logger.verbose(`Initial viewport size: ${actualViewportSize}`)

    // If the viewport size is already the required size
    if (actualViewportSize.equals(requiredViewportSize)) return true

    // We move the window to (0,0) to have the best chance to be able to
    // set the viewport size as requested.
    await controller.setWindowLocation({x: 0, y: 0}).catch(() => {
      logger.verbose('Warning: Failed to move the browser window to (0,0)')
    })

    await _setWindowSizeByViewportSize(
      logger,
      {controller},
      actualViewportSize,
      requiredViewportSize,
    )
    actualViewportSize = await getViewportSize(logger, {executor})
    if (actualViewportSize.equals(requiredViewportSize)) return true

    // Additional attempt. This Solves the "maximized browser" bug
    // (border size for maximized browser sometimes different than non-maximized, so the original browser size calculation is wrong).
    logger.verbose('Trying workaround for maximization...')
    await _setWindowSizeByViewportSize(
      logger,
      {controller},
      actualViewportSize,
      requiredViewportSize,
    )
    actualViewportSize = await getViewportSize(logger, {executor})
    if (actualViewportSize.equals(requiredViewportSize)) return true

    const MAX_DIFF = 3
    const widthDiff = Math.abs(actualViewportSize.getWidth() - requiredViewportSize.getWidth())
    const heightDiff = Math.abs(actualViewportSize.getHeight() - requiredViewportSize.getHeight())

    // We try the zoom workaround only if size difference is reasonable.
    if (widthDiff <= MAX_DIFF && heightDiff <= MAX_DIFF) {
      logger.verbose('Trying workaround for zoom...')

      return _adjustWindowSizeByViewportSize(
        logger,
        {controller, executor},
        actualViewportSize,
        requiredViewportSize,
      )
    } else {
      throw new Error('Failed to set viewport size!')
    }
  })
}

async function _setWindowSizeByViewportSize(
  logger,
  {controller},
  actualViewportSize,
  requiredViewportSize,
) {
  const actualWindowSize = await controller.getWindowSize()
  const requiredWindowSize = new RectangleSize(
    actualWindowSize.getWidth() + (requiredViewportSize.getWidth() - actualViewportSize.getWidth()),
    actualWindowSize.getHeight() +
      (requiredViewportSize.getHeight() - actualViewportSize.getHeight()),
  )
  return _setWindowSize(logger, {controller}, requiredWindowSize)
}

async function _adjustWindowSizeByViewportSize(
  logger,
  {controller, executor},
  actualViewportSize,
  requiredViewportSize,
) {
  const widthDiff = actualViewportSize.getWidth() - requiredViewportSize.getWidth()
  const widthStep = widthDiff > 0 ? -1 : 1 // -1 for smaller size, 1 for larger
  const heightDiff = actualViewportSize.getHeight() - requiredViewportSize.getHeight()
  const heightStep = heightDiff > 0 ? -1 : 1

  const actualWindowSize = await controller.getWindowSize()
  let lastRequiredBrowserSize = null
  let retries = Math.abs((widthDiff || 1) * (heightDiff || 1)) * 2
  let widthChange = 0
  let heightChange = 0
  while (
    --retries > 0 &&
    (Math.abs(widthChange) <= Math.abs(widthDiff) || Math.abs(heightChange) <= Math.abs(heightDiff))
  ) {
    logger.verbose(`Retries left: ${retries}`)
    // We specifically use "<=" (and not "<"), so to give an extra resize attempt
    // in addition to reaching the diff, due to floating point issues.
    if (
      Math.abs(widthChange) <= Math.abs(widthDiff) &&
      actualViewportSize.getWidth() !== requiredViewportSize.getWidth()
    ) {
      widthChange += widthStep
    }

    if (
      Math.abs(heightChange) <= Math.abs(heightDiff) &&
      actualViewportSize.getHeight() !== requiredViewportSize.getHeight()
    ) {
      heightChange += heightStep
    }

    const requiredWindowSize = new RectangleSize(
      actualWindowSize.getWidth() + widthChange,
      actualWindowSize.getHeight() + heightChange,
    )

    if (requiredWindowSize.equals(lastRequiredBrowserSize)) {
      logger.verbose('Browser size is as required but viewport size does not match!')
      logger.verbose(`Browser size: ${requiredWindowSize}, Viewport size: ${actualViewportSize}`)
      logger.verbose('Stopping viewport size attempts.')
      return true
    }

    await _setWindowSize(logger, {controller}, requiredWindowSize)
    lastRequiredBrowserSize = requiredWindowSize
    actualViewportSize = getViewportSize(logger, {executor})

    logger.verbose('Current viewport size:', actualViewportSize)
    if (actualViewportSize.equals(requiredViewportSize)) {
      return true
    }
  }
  throw new Error('EyesError: failed to set window size! Zoom workaround failed.')
}

async function _setWindowSize(logger, {controller}, requiredWindowSize, sleep = 3000, retries = 3) {
  try {
    while (retries >= 0) {
      await controller.setWindowSize(requiredWindowSize)
      await GeneralUtils.sleep(sleep)
      const actualWindowSize = await controller.getWindowSize()
      if (actualWindowSize.equals(requiredWindowSize)) return true
      retries -= 1
    }
    logger.verbose('Failed to set browser size: retries is out.')
    return false
  } catch (ignored) {
    return false
  }
}

async function getTopContextViewportRect(logger, {controller, executor, context}) {
  return context.framesSwitchAndReturn(null, async () => {
    const location = await getTopContextScrollLocation(logger, {executor, context})
    const size = await getTopContextViewportSize(logger, {controller, executor, context})
    return new Region(location, size)
  })
}

async function getTopContextViewportSize(logger, {controller, context, executor}) {
  logger.verbose('getTopContextViewportSize')
  return context.framesSwitchAndReturn(null, async () => {
    logger.verbose('Extracting viewport size...')
    let viewportSize
    try {
      viewportSize = await getViewportSize({executor})
    } catch (err) {
      logger.verbose('Failed to extract viewport size using Javascript:', err)
      // If we failed to extract the viewport size using JS, will use the window size instead.
      logger.verbose('Using window size as viewport size.')

      const windowSize = await controller.getWindowSize()
      let width = windowSize.getWidth()
      let height = windowSize.getHeight()
      const isLandscapeOrientation = await controller.isLandscapeOrientation().catch(() => {
        // Not every IWebDriver supports querying for orientation.
      })
      if (isLandscapeOrientation && height > width) {
        const temp = width
        width = height
        height = temp
      }
      viewportSize = new RectangleSize(width, height)
    }
    logger.verbose('Done! Viewport size: ', viewportSize)
    return viewportSize
  })
}

async function getCurrentFrameContentEntireSize(_logger, executor) {
  try {
    const [width, height] = await executor.executeScript(EyesJsSnippets.GET_CONTENT_ENTIRE_SIZE)
    return new RectangleSize(Number.parseInt(width, 10) || 0, Number.parseInt(height, 10) || 0)
  } catch (err) {
    throw new EyesDriverOperationError('Failed to extract entire size!', err)
  }
}

async function getElementEntireSize(_logger, executor, element) {
  try {
    const [width, height] = await executor.executeScript(
      EyesJsSnippets.GET_ELEMENT_ENTIRE_SIZE,
      element,
    )
    return new RectangleSize(Number.parseInt(width, 10) || 0, Number.parseInt(height, 10) || 0)
  } catch (err) {
    throw new EyesDriverOperationError('Failed to extract element size!', err)
  }
}

async function getDevicePixelRatio(_logger, {executor}) {
  const devicePixelRatio = await executor.executeScript('return window.devicePixelRatio')
  return Number.parseFloat(devicePixelRatio)
}

async function getMobilePixelRatio(_logger, {controller}, viewportSize) {
  const screenshot64 = await controller.takeScreenshot()
  const screenshot = new MutableImage(screenshot64)
  return screenshot.getWidth() / viewportSize.getWidth()
}

async function getTopContextScrollLocation(logger, {context, executor}) {
  // TODO I think we can use here Frame::parentScrollLocation
  return context.framesSwitchAndReturn(null, async () => getScrollLocation(logger, executor))
}

async function getScrollLocation(_logger, executor, element) {
  const [x, y] = await executor.executeScript(EyesJsSnippets.GET_SCROLL_POSITION, element)
  return new Location(Math.ceil(Number.parseFloat(x)) || 0, Math.ceil(Number.parseFloat(y)) || 0)
}

async function scrollTo(_logger, executor, location, element) {
  const [x, y] = await executor.executeScript(
    EyesJsSnippets.SCROLL_TO(location.getX(), location.getY()),
    element,
  )
  return new Location(Math.ceil(Number.parseFloat(x)) || 0, Math.ceil(Number.parseFloat(y)) || 0)
}

async function getTransforms(_logger, executor, element) {
  return executor.executeScript(EyesJsSnippets.GET_TRANSFORMS, element)
}

async function setTransforms(_logger, executor, transforms, element) {
  return executor.executeScript(EyesJsSnippets.SET_TRANSFORMS(transforms), element)
}

async function getTranslateLocation(_logger, executor, element) {
  const transforms = await getTransforms(_logger, executor, element)
  const translateLocations = Object.values(transforms)
    .filter(transform => Boolean(transform))
    .map(transform => {
      const data = transform.match(/^translate\(\s*(\-?[\d, \.]+)px,\s*(\-?[\d, \.]+)px\s*\)/)
      if (!data) {
        throw new Error(`Can't parse CSS transition: ${transform}!`)
      }
      const [_, x, y] = data
      return new Location(Math.round(-Number.parseFloat(x)), Math.round(-Number.parseFloat(y)))
    })
  if (translateLocations.some(location => !translateLocations[0].equals(location))) {
    throw new Error('Got different css positions!')
  }
  return translateLocations[0] || Location.ZERO
}

async function translateTo(_logger, executor, location, element) {
  await executor.executeScript(
    EyesJsSnippets.TRANSLATE_TO(location.getX(), location.getY()),
    element,
  )
  return location
}

async function getScrollRootElement(_logger, executor) {
  return executor.executeScript(EyesJsSnippets.GET_SCROLL_ROOT_ELEMENT)
}

async function markScrollRootElement(_logger, executor, element) {
  return executor.executorScript(EyesJsSnippets.MARK_SCROLL_ROOT_ELEMENT, element)
}

async function getOverflow(_logger, executor, element) {
  ArgumentGuard.notNull(executor, 'executor')
  ArgumentGuard.notNull(element, 'element')
  return executor.executeScript(EyesJsSnippets.GET_OVERFLOW, element)
}

async function setOverflow(_logger, executor, overflow, element) {
  ArgumentGuard.notNull(executor, 'executor')
  ArgumentGuard.notNull(element, 'element')

  try {
    const result = await executor.executeScript(
      EyesJsSnippets.SET_OVERFLOW_AND_RETURN_ORIGIN_VALUE(overflow),
      element,
    )
    await GeneralUtils.sleep(200)
    return result
  } catch (err) {
    throw new EyesError('Failed to set overflow', err)
  }
}

async function blurElement(logger, executor, element) {
  try {
    return await executor.executeScript(EyesJsSnippets.BLUR_ELEMENT, element)
  } catch (err) {
    logger.verbose(`WARNING: Cannot hide caret! ${err}`)
  }
}

async function focusElement(logger, executor, element) {
  try {
    return await executor.executeScript(EyesJsSnippets.FOCUS_ELEMENT, element)
  } catch (err) {
    logger.verbose(`WARNING: Cannot hide caret! ${err}`)
  }
}

async function getElementAbsoluteXpath(_logger, executor, element) {
  return executor.executeScript(EyesJsSnippets.GET_ELEMENT_ABSOLUTE_XPATH, element)
}

async function getElementXpath(logger, executor, element) {
  try {
    return await executor.executeScript(EyesJsSnippets.GET_ELEMENT_XPATH, element)
  } catch (err) {
    logger.verbose('Warning: Failed to get element selector (xpath)')
    return null
  }
}

async function locatorToPersistedRegions(_logger, {finder, executor}, locator) {
  if (locator.using === 'xpath') {
    return [{type: 'xpath', selector: locator.value}]
  } else if (locator.using === 'css selector') {
    return [{type: 'css', selector: locator.value}]
  } else {
    const elements = await finder.findElements(locator)
    return Promise.all(
      elements.map(async element => ({
        type: 'xpath',
        selector: await getElementAbsoluteXpath(executor, element),
      })),
    )
  }
}

async function getCurrentContextInfo(_logger, executor) {
  return executor.executeScript(EyesJsSnippets.GET_CURRENT_CONTEXT_INFO)
}

async function findFrameByContext(logger, {executor, context}, contextInfo, comparator) {
  const framesInfo = await executor.executeScript(EyesJsSnippets.GET_FRAMES)
  for (const frameInfo of framesInfo) {
    if (frameInfo.isCORS !== contextInfo.isCORS) continue
    await context.frame(frameInfo.element)
    const contentDocument = await executor.executeScript('return document')
    await context.frameParent()
    if (comparator(contentDocument, contextInfo.document)) {
      frameInfo.selector = await getElementXpath(logger, executor, frameInfo.element)
      return frameInfo
    }
  }
}

async function ensureElementVisible(
  logger,
  {controller, context, executor},
  positionProvider,
  element,
) {
  if (!element) return
  if (await controller.isMobileDevice()) {
    logger.verbose(`NATIVE context identified, skipping 'ensure element visible'`)
    return
  }
  const frameChain = context.frameChain
  const elementFrameRect = await element.getBounds()
  const frameOffset = frameChain.getCurrentFrameOffset()
  const elementViewportRect = elementFrameRect.offset(frameOffset.getX(), frameOffset.getY())
  const viewportRect = await getTopContextViewportRect(logger, {controller, context, executor})
  if (!viewportRect.contains(elementViewportRect)) {
    const effectiveViewportRect = await ensureFrameVisible(logger, context, positionProvider)
    const elementLocation = await element.getLocation()
    const scrollRootElement = frameChain.current ? frameChain.current.scrollRootElement : null
    await positionProvider.setPosition(elementLocation, scrollRootElement)
    return effectiveViewportRect
  }
}

async function ensureFrameVisible(_logger, context, positionProvider) {
  const frameChain = context.frameChain
  let offset = Location.ZERO
  for (let index = frameChain.size - 1; index >= 0; --index) {
    await context.frameParent()
    const prevFrame = frameChain.frameAt(index)
    const currentFrame = frameChain.frameAt(index - 1)

    offset = offset.offsetByLocation(prevFrame.location)
    const scrollRootElement = currentFrame ? currentFrame.scrollRootElement : null
    const actualOffset = await positionProvider.setPosition(offset, scrollRootElement)
    offset = offset.offsetNegative(actualOffset)
  }
  // passing array of frame references instead of frame chain to be sure that frame metrics will be re-calculated
  await context.frames(Array.from(frameChain, frame => frame.toReference()))
}

module.exports = {
  getViewportSize,
  setViewportSize,
  getTopContextViewportRect,
  getTopContextViewportSize,
  getCurrentFrameContentEntireSize,
  getElementEntireSize,
  getDevicePixelRatio,
  getMobilePixelRatio,
  getTopContextScrollLocation,
  getScrollLocation,
  scrollTo,
  getTransforms,
  setTransforms,
  getTranslateLocation,
  translateTo,
  getScrollRootElement,
  markScrollRootElement,
  getOverflow,
  setOverflow,
  blurElement,
  focusElement,
  getElementXpath,
  getElementAbsoluteXpath,
  locatorToPersistedRegions,
  ensureElementVisible,
  ensureFrameVisible,
  getCurrentContextInfo,
  findFrameByContext,
}
