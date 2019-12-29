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
const supportedTests = require('./supported-tests')

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

  async function checkFrame(
    locator,
    {isClassicApi = false, isFully = false, tag, matchTimeout} = {},
  ) {
    if (isClassicApi) {
      await eyes.checkFrame(By.css(locator), matchTimeout, tag)
    } else {
      await eyes.check(tag, Target.frame(By.css(locator)).fully(isFully))
    }
  }

  async function checkRegion(
    target,
    {isClassicApi = false, isFully = false, inFrame, tag, matchTimeout, ignoreRegion} = {},
  ) {
    if (isClassicApi) {
      inFrame
        ? await eyes.checkRegionInFrame(By.css(inFrame), By.css(target), matchTimeout, tag, isFully)
        : await eyes.checkRegionBy(By.css(target), tag, matchTimeout, isFully)
    } else {
      ignoreRegion
        ? await eyes.check(
            tag,
            Target.region(By.css(target))
              .fully(isFully)
              .ignoreRegions(makeRegion(ignoreRegion)),
          )
        : await eyes.check(tag, Target.region(makeRegion(target)).fully(isFully))
    }
  }

  const makeRegion = target => {
    return typeof target === 'string' ? By.css(target) : new Region(target)
  }

  async function checkWindow({
    isClassicApi = false,
    isFully = false,
    tag,
    matchTimeout,
    ignoreRegion,
    floatingRegion,
  } = {}) {
    if (isClassicApi) {
      await eyes.checkWindow(tag, matchTimeout, isFully)
    } else {
      let target = Target.window()
        .fully(isFully)
        .ignoreCaret()
      if (ignoreRegion) {
        target.ignoreRegions(makeRegion(ignoreRegion))
      } else if (floatingRegion) {
        target.floatingRegion(
          makeRegion(floatingRegion.target),
          floatingRegion.maxUp,
          floatingRegion.maxDown,
          floatingRegion.maxLeft,
          floatingRegion.maxRight,
        )
      }
      await eyes.check(undefined, target)
    }
  }

  async function close(options) {
    await eyes.close(options)
  }

  async function scrollDown(pixels) {
    await driver.executeScript(`window.scrollBy(0,${pixels})`)
  }

  async function type(locator, inputText) {
    await driver.findElement(By.css(locator)).sendKeys(inputText)
  }

  async function cleanup() {
    await driver.close()
    await eyes.abortIfNotClosed()
  }

  return {visit, open, checkFrame, checkRegion, checkWindow, close, scrollDown, type, cleanup}
}

module.exports = {
  name: sdkName,
  initialize,
  supportedTests,
}
