const takeDomSnapshot = require('./takeDomSnapshot')
const chalk = require('chalk')
const GeneralUtils = require('./GeneralUtils')
const TypeUtils = require('./TypeUtils')

async function takeDomSnapshots({
  breakpoints,
  browsers,
  disableBrowserFetching,
  driver,
  logger,
  showLogs,
  useSessionCache,
  viewportSize,
  getEmulatedDevicesSizes,
  getIosDevicesSizes,
}) {
  if (!breakpoints) {
    logger.verbose(`taking single dom snapshot`)
    const snapshot = await takeDomSnapshot(logger, driver, {
      disableBrowserFetching,
      showLogs,
      useSessionCache,
    })
    return Array(browsers.length).fill(snapshot)
  }

  const requiredWidths = await getRequiredWidths()
  const isStrictBreakpoints = Array.isArray(breakpoints)
  const smallestBreakpoint = Math.min(...(isStrictBreakpoints ? breakpoints : []))

  if (isStrictBreakpoints && requiredWidths.has(smallestBreakpoint - 1)) {
    const smallestBrowsers = requiredWidths
      .get(smallestBreakpoint - 1)
      .map(({name, width}) => `(${name}, ${width})`)
      .join(', ')
    const message = chalk.yellow(
      `The following configuration's viewport-widths are smaller than the smallest configured layout breakpoint (${smallestBreakpoint} pixels): [${smallestBrowsers}]. As a fallback, the resources that will be used for these configurations have been captured on a viewport-width of ${smallestBreakpoint} - 1 pixels. If an additional layout breakpoint is needed for you to achieve better results - please add it to your configuration.`,
    )
    console.log(message)
  }

  logger.verbose(`taking multiple dom snapshots for breakpoints: ${breakpoints}`)
  logger.verbose(`required widths: ${[...requiredWidths.keys()].join(', ')}`)
  const snapshots = Array(browsers.length)
  if (requiredWidths.has(viewportSize.width)) {
    logger.log(`taking dom snapshot for existing width ${viewportSize.width}`)
    const snapshot = await takeDomSnapshot(logger, driver, {disableBrowserFetching})
    requiredWidths.get(viewportSize.width).forEach(({index}) => (snapshots[index] = snapshot))
  }
  for (const [requiredWidth, browsersInfo] of requiredWidths.entries()) {
    logger.log(`taking dom snapshot for width ${requiredWidth}`)
    try {
      await driver.setViewportSize({width: requiredWidth, height: viewportSize.height})
    } catch (err) {
      const actualViewportSize = await driver.getViewportSize()
      if (isStrictBreakpoints) {
        const failedBrowsers = browsersInfo.map(({name, width}) => `(${name}, ${width})`).join(', ')
        const message = chalk.yellow(
          `One of the configured layout breakpoints is ${requiredWidth} pixels, while your local browser has a limit of ${actualViewportSize.width}, so the SDK couldn't resize it to the desired size. As a fallback, the resources that will be used for the following configurations: [${failedBrowsers}] have been captured on the browser's limit (${actualViewportSize.width} pixels). To resolve this, you may use a headless browser as it can be resized to any size.`,
        )
        console.log(message)
      } else {
        const failedBrowsers = browsersInfo.map(({name}) => `(${name})`).join(', ')
        const message = chalk.yellow(
          `The following configurations [${failedBrowsers}] have a viewport-width of ${requiredWidth} pixels, while your local browser has a limit of ${actualViewportSize.width} pixels, so the SDK couldn't resize it to the desired size. As a fallback, the resources that will be used for these checkpoints have been captured on the browser's limit (${actualViewportSize.width} pixels). To resolve this, you may use a headless browser as it can be resized to any size.`,
        )
        console.log(message)
      }
    }
    const snapshot = await takeDomSnapshot(logger, driver, {disableBrowserFetching})
    browsersInfo.forEach(({index}) => (snapshots[index] = snapshot))
  }
  await driver.setViewportSize(viewportSize)
  return snapshots

  async function getRequiredWidths() {
    return await browsers.reduce((widths, browser, index) => {
      const browserInfo = getBrowserInfo(browser)
      return widths.then(async widths => {
        const {type, name, width} = await browserInfo
        const requiredWidth = GeneralUtils.getBreakpointWidth(breakpoints, width)
        let groupedBrowsers = widths.get(requiredWidth)
        if (!groupedBrowsers) {
          groupedBrowsers = []
          widths.set(requiredWidth, groupedBrowsers)
        }
        groupedBrowsers.push({index, width, type, name})
        return widths
      })
    }, Promise.resolve(new Map()))
  }

  async function getBrowserInfo(browser) {
    if (TypeUtils.has(browser, 'name')) {
      const {name, width, height} = browser
      return {name, width, height}
    } else {
      let devicesSizes, browserObj
      if (TypeUtils.has(browser, 'chromeEmulationInfo') || TypeUtils.has(browser, 'deviceName')) {
        browserObj = browser.chromeEmulationInfo || browser
        devicesSizes = await getEmulatedDevicesSizes()
      } else if (TypeUtils.has(browser, 'iosDeviceInfo')) {
        browserObj = browser.iosDeviceInfo
        devicesSizes = await getIosDevicesSizes()
      }
      const {deviceName, screenOrientation = 'portrait'} = browserObj
      const size = devicesSizes[deviceName][screenOrientation]
      return {name: deviceName, screenOrientation, ...size}
    }
  }
}
module.exports = takeDomSnapshots
