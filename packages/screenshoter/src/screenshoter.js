const utils = require('@applitools/utils')
const makeScroller = require('./scroller')
const takeStitchedScreenshot = require('./takeStitchedScreenshot')
const takeViewportScreenshot = require('./takeViewportScreenshot')

async function screenshoter({
  logger,
  driver,
  context,
  target,
  isFully,
  hideScrollbars,
  hideCaret,
  scrollingMode,
  overlap,
  wait,
  rotate,
  crop,
  scale,
  debug,
}) {
  const originalContext = driver.currentContext
  const defaultScroller = makeScroller({logger, scrollingMode})

  const targetContext = context ? await originalContext.context(context) : originalContext
  const scrollingStates = []
  for (const currentContext of targetContext.path) {
    const scrollingElement = await currentContext.getScrollRootElement()
    if (hideScrollbars) await scrollingElement.hideScrollbars()
    const scrollingState = await defaultScroller.getState(scrollingElement)
    scrollingStates.push(scrollingState)
  }

  const {region, scroller} = await getTargetArea({
    logger,
    context: targetContext,
    target,
    isFully,
    scrollingMode,
  })
  const options = {logger, context: targetContext, region, scroller, rotate, crop, scale, debug}

  const activeElement = hideCaret && !driver.isNative ? await targetContext.blurElement() : null

  try {
    return isFully
      ? await takeStitchedScreenshot({...options, wait, overlap})
      : await takeViewportScreenshot({...options})
  } finally {
    if (hideCaret && activeElement) await targetContext.focusElement(activeElement)
  }
}

async function getTargetArea({logger, context, target, isFully, scrollingMode}) {
  if (target) {
    if (utils.types.has(target, ['x', 'y', 'width', 'height'])) {
      const scrollingElement = await context.getScrollRootElement()
      const scroller = makeScroller({logger, element: scrollingElement, scrollingMode})
      return {region: target, scroller}
    } else {
      const element = await context.element(target)
      if (!element) throw new Error('Element not found!')

      if (isFully) {
        const isScrollable = await element.isScrollable()
        const scrollingElement = isScrollable ? element : await context.getScrollRootElement()
        const scroller = makeScroller({logger, element: scrollingElement, scrollingMode})
        const region = isScrollable ? null : await element.getRect()
        return {region, scroller}
      } else {
        const scrollingElement = await context.getScrollRootElement()
        const scroller = makeScroller({logger, element: scrollingElement, scrollingMode})
        const region = await element.getRect()
        return {region, scroller}
      }
    }
  } else if (!context.isMain && !isFully) {
    const scrollingElement = await context.parent.getScrollRootElement()
    const scroller = makeScroller({logger, element: scrollingElement, scrollingMode})
    const element = await context.getFrameElement()
    const region = await element.getClientRect()
    return {region, scroller}
  } else {
    const scrollingElement = await context.getScrollRootElement()
    const scroller = makeScroller({logger, element: scrollingElement, scrollingMode})
    return {scroller}
  }
}

module.exports = screenshoter
