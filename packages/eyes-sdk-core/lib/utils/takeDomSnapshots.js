const takeDomSnapshot = require('./takeDomSnapshot')
const chalk = require('chalk')
const GeneralUtils = require('./GeneralUtils')
const TypeUtils = require('./TypeUtils')
const ServerConnector = require('../..')

async function _getRequiredWidths({browsers, breakpoints}) {
  return await browsers.reduce((widths, browser, index) => {
    const browserInfo = _getBrowserInfo(browser)
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

async function _getBrowserInfo(browser) {
  if (TypeUtils.has(browser, 'name')) {
    const {name, width, height} = browser
    return {type: 'browser', name, width, height}
  } else if (
    TypeUtils.has(browser, 'chromeEmulationInfo') ||
    TypeUtils.has(browser, 'deviceName')
  ) {
    const {deviceName, screenOrientation = 'portrait'} = browser.chromeEmulationInfo || browser
    let _emulatedDevicesSizesPromise
    if (!_emulatedDevicesSizesPromise) {
      //await this.getAndSaveRenderingInfo()
      const serverUrl = 'https://render-wus.applitools.com' // TODO: find a better way to do this
      const serverConnector = new ServerConnector()
      _emulatedDevicesSizesPromise = serverConnector.getEmulatedDevicesSizes(serverUrl)
    }
    const devicesSizes = await _emulatedDevicesSizesPromise
    const size = devicesSizes[deviceName][screenOrientation]
    return {type: 'emulation', name: deviceName, screenOrientation, ...size}
  } else if (TypeUtils.has(browser, 'iosDeviceInfo')) {
    const {deviceName, screenOrientation = 'portrait'} = browser.iosDeviceInfo
    let _iosDevicesSizesPromise
    if (!_iosDevicesSizesPromise) {
      //await this.getAndSaveRenderingInfo()
      const serverUrl = 'https://render-wus.applitools.com' // TODO: find a better way to do this
      const serverConnector = new ServerConnector()
      _iosDevicesSizesPromise = serverConnector.getIosDevicesSizes(serverUrl)
    }
    const devicesSizes = await _iosDevicesSizesPromise
    const size = devicesSizes[deviceName][screenOrientation]
    return {type: 'ios', name: deviceName, screenOrientation, ...size}
  }
}
async function takeDomSnapshots({
  breakpoints,
  browsers,
  disableBrowserFetching,
  driver,
  logger,
  showLogs,
  useSessionCache,
  viewportSize,
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

  const requiredWidths = await this._getRequiredWidths({browsers, breakpoints})
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
  if (requiredWidths.has(viewportSize.getWidth())) {
    logger.log(`taking dom snapshot for existing width ${viewportSize.getWidth()}`)
    const snapshot = await takeDomSnapshot(logger, driver, {disableBrowserFetching})
    requiredWidths.get(viewportSize.getWidth()).forEach(({index}) => (snapshots[index] = snapshot))
  }
  for (const [requiredWidth, browsersInfo] of requiredWidths.entries()) {
    logger.log(`taking dom snapshot for width ${requiredWidth}`)
    try {
      await driver.setViewportSize({width: requiredWidth, height: viewportSize.getHeight()})
    } catch (err) {
      const actualViewportSize = await driver.getViewportSize()
      if (isStrictBreakpoints) {
        const failedBrowsers = browsersInfo.map(({name, width}) => `(${name}, ${width})`).join(', ')
        const message = chalk.yellow(
          `One of the configured layout breakpoints is ${requiredWidth} pixels, while your local browser has a limit of ${actualViewportSize.getWidth()}, so the SDK couldn't resize it to the desired size. As a fallback, the resources that will be used for the following configurations: [${failedBrowsers}] have been captured on the browser's limit (${actualViewportSize.getWidth()} pixels). To resolve this, you may use a headless browser as it can be resized to any size.`,
        )
        console.log(message)
      } else {
        const failedBrowsers = browsersInfo.map(({name}) => `(${name})`).join(', ')
        const message = chalk.yellow(
          `The following configurations [${failedBrowsers}] have a viewport-width of ${requiredWidth} pixels, while your local browser has a limit of ${actualViewportSize.getWidth()} pixels, so the SDK couldn't resize it to the desired size. As a fallback, the resources that will be used for these checkpoints have been captured on the browser's limit (${actualViewportSize.getWidth()} pixels). To resolve this, you may use a headless browser as it can be resized to any size.`,
        )
        console.log(message)
      }
    }
    const snapshot = await takeDomSnapshot(logger, driver, {disableBrowserFetching})
    browsersInfo.forEach(({index}) => (snapshots[index] = snapshot))
  }
  await driver.setViewportSize(viewportSize)
  return snapshots
}

module.exports = takeDomSnapshots
