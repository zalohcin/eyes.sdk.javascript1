require('chromedriver')
const {Builder, By} = require('selenium-webdriver')
const {Options: ChromeOptions} = require('selenium-webdriver/chrome')
const {
  Eyes,
  BatchInfo,
  RectangleSize,
  Target,
  StitchMode,
  VisualGridRunner,
  Region,
} = require('../../index')

const sdkName = 'eyes-selenium'
const batch = new BatchInfo(`JS Coverage Tests - ${sdkName}`)

async function initialize({baselineTestName, branchName, executionMode, host}) {
  let eyes
  let driver

  driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(new ChromeOptions().headless())
    .usingServer(host)
    .build()
  eyes = executionMode.isVisualGrid ? new Eyes(new VisualGridRunner()) : new Eyes()
  executionMode.isCssStitching ? eyes.setStitchMode(StitchMode.CSS) : undefined
  executionMode.isScrollStitching ? eyes.setStitchMode(StitchMode.SCROLL) : undefined
  eyes.setBranchName(branchName)
  eyes.setBatch(batch)

  async function visit(url) {
    await driver.get(url)
  }

  async function open(options) {
    driver = await eyes.open(
      driver,
      options.appName,
      baselineTestName,
      RectangleSize.parse(options.viewportSize),
    )
  }

  async function checkFrame({
    isClassicApi = false,
    isFully = false,
    locator,
    tag,
    matchTimeout,
  } = {}) {
    if (isClassicApi) {
      await eyes.checkFrame(By.css(locator), matchTimeout, tag)
    } else {
      await eyes.check(tag, Target.frame(By.css(locator)).fully(isFully))
    }
  }

  async function checkRegion({
    isClassicApi = false,
    isFully = false,
    locator,
    inFrameLocator,
    tag,
    matchTimeout,
    ignoreRegion,
  } = {}) {
    if (isClassicApi) {
      inFrameLocator
        ? await eyes.checkRegionInFrame(
            By.css(inFrameLocator),
            By.css(locator),
            matchTimeout,
            tag,
            isFully,
          )
        : await eyes.checkRegionBy(By.css(locator), tag, matchTimeout, isFully)
    } else {
      ignoreRegion
        ? await eyes.check(tag, Target.region(By.css(locator)).fully(isFully))
        : await eyes.check(
            tag,
            Target.region(By.css(locator))
              .fully(isFully)
              .ignoreRegions(new Region(ignoreRegion)),
          )
    }
  }

  async function checkWindow({
    isClassicApi = false,
    isFully = false,
    tag,
    matchTimeout,
    ignoreRegion,
  } = {}) {
    if (isClassicApi) {
      await eyes.checkWindow(tag, matchTimeout, isFully)
    } else {
      ignoreRegion
        ? await eyes.check(
            undefined,
            Target.window()
              .fully(isFully)
              .ignoreRegions(new Region(ignoreRegion)),
          )
        : await eyes.check(undefined, Target.window().fully(isFully))
    }
  }

  async function close(options) {
    await eyes.close(options)
  }

  async function scrollDown({pixels}) {
    await driver.executeScript(`window.scrollBy(0,${pixels})`)
  }

  async function cleanup() {
    await driver.close()
    await eyes.abortIfNotClosed()
  }

  return {visit, open, checkFrame, checkRegion, checkWindow, close, scrollDown, cleanup}
}

const supportedTests = [
  {name: 'TestCheckFrame', executionMode: {isVisualGrid: true}},
  {name: 'TestCheckFrame', executionMode: {isCssStitching: true}},
  {name: 'TestCheckFrame', executionMode: {isScrollStitching: true}},
  {name: 'TestCheckRegion', executionMode: {isVisualGrid: true}},
  {name: 'TestCheckRegion', executionMode: {isCssStitching: true}},
  {name: 'TestCheckRegion', executionMode: {isScrollStitching: true}},
  {name: 'TestCheckRegion2', executionMode: {isVisualGrid: true}},
  {name: 'TestCheckRegion2', executionMode: {isCssStitching: true}},
  {name: 'TestCheckRegion2', executionMode: {isScrollStitching: true}},
  {name: 'TestCheckRegionInFrame', executionMode: {isVisualGrid: true}},
  {name: 'TestCheckRegionInFrame', executionMode: {isCssStitching: true}},
  {name: 'TestCheckRegionInFrame', executionMode: {isScrollStitching: true}},
  {name: 'TestCheckWindow', executionMode: {isVisualGrid: true}},
  {name: 'TestCheckWindow', executionMode: {isCssStitching: true}},
  {name: 'TestCheckWindow', executionMode: {isScrollStitching: true}},
  {name: 'TestCheckWindowAfterScroll', executionMode: {isVisualGrid: true}},
  {name: 'TestCheckWindowAfterScroll', executionMode: {isCssStitching: true}},
  {name: 'TestCheckWindowAfterScroll', executionMode: {isScrollStitching: true}},
  {name: 'TestCheckWindowFully', executionMode: {isVisualGrid: true}},
  {name: 'TestCheckWindowFully', executionMode: {isCssStitching: true}},
  {name: 'TestCheckWindowFully', executionMode: {isScrollStitching: true}},
  {name: 'TestCheckWindowViewport', executionMode: {isVisualGrid: true}},
  {name: 'TestCheckWindowViewport', executionMode: {isCssStitching: true}},
  {name: 'TestCheckWindowViewport', executionMode: {isScrollStitching: true}},
  {name: 'TestDoubleCheckWindow', executionMode: {isVisualGrid: true}},
  {name: 'TestDoubleCheckWindow', executionMode: {isCssStitching: true}},
  {name: 'TestDoubleCheckWindow', executionMode: {isScrollStitching: true}},
  {name: 'TestCheckElementFully_Fluent', executionMode: {isVisualGrid: true}},
  {name: 'TestCheckElementFully_Fluent', executionMode: {isCssStitching: true}},
  {name: 'TestCheckElementFully_Fluent', executionMode: {isScrollStitching: true}},
  {name: 'TestCheckFrame_Fluent', executionMode: {isVisualGrid: true}},
  {name: 'TestCheckFrame_Fluent', executionMode: {isCssStitching: true}},
  {name: 'TestCheckFrame_Fluent', executionMode: {isScrollStitching: true}},
  {name: 'TestCheckFrameFully_Fluent', executionMode: {isVisualGrid: true}},
  {name: 'TestCheckFrameFully_Fluent', executionMode: {isCssStitching: true}},
  {name: 'TestCheckFrameFully_Fluent', executionMode: {isScrollStitching: true}},
  {name: 'TestCheckRegionBySelectorAfterManualScroll_Fluent', executionMode: {isVisualGrid: true}},
  {
    name: 'TestCheckRegionBySelectorAfterManualScroll_Fluent',
    executionMode: {isCssStitching: true},
  },
  {
    name: 'TestCheckRegionBySelectorAfterManualScroll_Fluent',
    executionMode: {isScrollStitching: true},
  },
  {name: 'TestCheckRegionWithIgnoreRegion_Fluent', executionMode: {isVisualGrid: true}},
  {name: 'TestCheckRegionWithIgnoreRegion_Fluent', executionMode: {isCssStitching: true}},
  {name: 'TestCheckRegionWithIgnoreRegion_Fluent', executionMode: {isScrollStitching: true}},
  {name: 'TestCheckWindow_Fluent', executionMode: {isVisualGrid: true}},
  {name: 'TestCheckWindow_Fluent', executionMode: {isCssStitching: true}},
  {name: 'TestCheckWindow_Fluent', executionMode: {isScrollStitching: true}},
  {name: 'TestCheckWindowWithIgnoreRegion_Fluent', executionMode: {isVisualGrid: true}},
  {name: 'TestCheckWindowWithIgnoreRegion_Fluent', executionMode: {isCssStitching: true}},
  {name: 'TestCheckWindowWithIgnoreRegion_Fluent', executionMode: {isScrollStitching: true}},
]

module.exports = {
  name: sdkName,
  initialize,
  supportedTests,
}
