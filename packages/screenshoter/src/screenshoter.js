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

  const targetContext = await originalContext.context(context)
  const scrollingStates = []
  for (const currentContext of targetContext.path) {
    const scrollingElement = await currentContext.getScrollRootElement()
    if (hideScrollbars) await scrollingElement.hideScrollbars()
    const scrollingState = await defaultScroller.getState(scrollingElement)
    scrollingStates.push(scrollingState)
  }

  const {region, scroller} = await getTargetArea({logger, context: targetContext, target, isFully})
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

async function getTargetArea({logger, context, target, isFully}) {
  let region
  let scrollingElement

  if (target) {
    if (utils.types.has(target, ['x', 'y', 'width', 'height'])) {
      region = target
      scrollingElement = await context.getScrollRootElement()
    } else {
      const element = await context.element(target)
      if (!element) throw new Error('Element not found!')

      if (isFully) {
        const isScrollable = await element.isScrollable()
        region = isScrollable ? null : await element.getRect()
        scrollingElement = isScrollable ? element : await context.getScrollRootElement()
      } else {
        region = await element.getRect()
        scrollingElement = await context.getScrollRootElement()
      }
    }
  } else if (!context.isMain) {
    if (isFully) {
      scrollingElement = await context.getScrollRootElement()
    } else {
      const element = await context.getFrameElement()
      region = await element.getClientRect()
      scrollingElement = await context.parent.getScrollRootElement()
    }
  } else {
    scrollingElement = await context.getScrollRootElement()
  }

  return {region, scrollingElement}
}

module.exports = screenshoter
