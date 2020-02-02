'use strict'
const {makeGetScreenshot} = require('@applitools/sdk-universal')
const toggleCaret = require('./toggleCaret')
const toggleScrollbars = require('./toggleScrollbars')
const takeScreenshot = require('./takeScreenshot')
const toGetScreenshotSettings = require('./toGetScreenshotSettings')
const getAppData = require('./getAppData')
const {
  AppOutput,
  GeneralUtils,
  Location,
  ImageMatchSettings,
  ImageMatchOptions: Options,
  MatchWindowData,
} = require('@applitools/eyes-sdk-core')

async function checkViewport({
  checkSettings,
  driver,
  serverConnector,
  renderingInfoPromise,
  runningSession,
}) {
  const {url, userAgent, title} = await getAppData(driver)
  // [-] hide scrollbars + getscrollroot element - EyesSelenium#check
  // [-] switch to defaultContent frame EyesSelemium#check
  // [-] validatig session start / end + wait before screenshots + skip if disabled - EyesBase#checkWindowBase

  // Screenshot
  // [-] has hide caret + frame switch - EyesSelenium#getScreenshot
  // [-] has scale + cutt + debug - EyesSelenium#_getElementScreenshot
  // [-] has EyesWebDriverScreenshot.fromScreenshotType - EyesSelenium#_getElementScreenshot
  // [-] has more cuts by imageProvidder (iOS fo example) - SafariScreenshotImageProvider#getImage
  // [-] has compression EyesBase#_getAppOutputWithScreenshot
  const getScreenshot = makeGetScreenshot({toggleScrollbars, takeScreenshot, toggleCaret})
  const getScreenshotSettings = toGetScreenshotSettings({checkSettings, driver})
  const screenshot = await getScreenshot(getScreenshotSettings)

  // DomCapture
  // [-] has check config for sendDom + setPosition 0,0 - EyesBase#_getAppOutputWithScreenshot (and DomCapture#getFullWindowDom)
  // [-] has custom DC script + getUrl + loop - DomCapture#getWindowDom
  // [-] has download CSS and implant + iframes - DomCapture#getFrameDom

  const dom = await getDOM(driver)

  await renderingInfoPromise
  const domUrl = await serverConnector.postDomSnapshot(dom)
  const screenshotId = GeneralUtils.guid()
  const screenshotUrl = await serverConnector.uploadScreenshot(screenshotId, screenshot)

  const matchWindowData = createMatchWindowdata({
    name: checkSettings.getName(),
    title,
    source: url,
    screenshotUrl,
    domUrl,
  })

  // Perform match.
  return serverConnector.matchWindow(runningSession, matchWindowData)

  // [-] Retry mechanism based on config sutff (for all of the above) - MatchWindowTask#_takeScreenshot
  // [-] updating _lastScreenshotBounds and _lastScreenshot if not ignoreMismatch in MatchWindowTask#matchWindow
  // [-] switchToParentFrame - EyesSelenium#check

  // [-] reset scrollbars - EyesSelenium#check
  // [-] if no result return empty result - EyesSelenium#check
}

async function getDOM() {
  return require('fs').readFileSync(require('path').resolve(__dirname, './_tmp/domc.json'))
}

function createMatchWindowdata({name, title, source, screenshotUrl, domUrl}) {
  // [-] has getting data from checkSettings and setting defaults + sets regions (with driver and screenshot) - MatchWindowTask#createImageMatchSettings
  const imageMatchSettings = new ImageMatchSettings({})
  // [-] gets userInputs here - EyesBase#matchWindow
  const options = new Options({
    name,
    userInputs: [],
    ignoreMismatch: false,
    ignoreMatch: false,
    forceMismatch: false,
    forceMatch: false,
    imageMatchSettings,
    source,
  })
  const appOutput = new AppOutput({
    title,
    screenshotUrl,
    domUrl,
    imageLocation: Location.ZERO,
  })
  return new MatchWindowData({
    userInputs: [],
    appOutput,
    name,
    ignoreMismatch: false,
    options,
  })
}

module.exports = checkViewport
