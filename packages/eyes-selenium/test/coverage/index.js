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

  async function open({appName, viewportSize}) {
    driver = await eyes.open(driver, appName, baselineTestName, RectangleSize.parse(viewportSize))
  }

  async function checkFrame(
    locator,
    {isClassicApi = false, isFully = false, tag, matchTimeout} = {},
  ) {
    if (isClassicApi) {
      await eyes.checkFrame(locator, matchTimeout, tag)
    } else {
      let _checkSettings
      if (Array.isArray(locator)) {
        locator.forEach((entry, index) => {
          index === 0 ? (_checkSettings = Target.frame(entry)) : _checkSettings.frame(entry)
        })
      } else {
        _checkSettings = Target.frame(locator)
      }
      _checkSettings.fully(isFully)
      await eyes.check(tag, _checkSettings)
    }
  }

  async function checkRegion(
    target,
    {isClassicApi = false, isFully = false, inFrame, ignoreRegion, tag, matchTimeout} = {},
  ) {
    if (isClassicApi) {
      inFrame
        ? await eyes.checkRegionInFrame(By.css(inFrame), By.css(target), matchTimeout, tag, isFully)
        : await eyes.checkRegionBy(By.css(target), tag, matchTimeout, isFully)
    } else {
      let _checkSettings
      if (Array.isArray(target)) {
        target.forEach((entry, index) => {
          index === 0
            ? (_checkSettings = Target.region(_makeRegionLocator(entry)))
            : _checkSettings.region(_makeRegionLocator(entry))
        })
      } else {
        _checkSettings = Target.region(
          _makeRegionLocator(target),
          inFrame ? By.css(inFrame) : undefined,
        ).fully(isFully)
      }
      if (ignoreRegion) {
        _checkSettings.ignoreRegions(_makeRegionLocator(ignoreRegion))
      }
      await eyes.check(tag, _checkSettings)
    }
  }

  const _makeRegionLocator = target => {
    if (typeof target === 'string') return By.css(target)
    else if (typeof target === 'number') return target
    else new Region(target)
  }

  async function checkWindow({
    isClassicApi = false,
    isFully = false,
    ignoreRegion,
    floatingRegion,
    scrollRootElement,
    tag,
    matchTimeout,
  } = {}) {
    if (isClassicApi) {
      await eyes.checkWindow(tag, matchTimeout, isFully)
    } else {
      let _checkSettings = Target.window()
        .fully(isFully)
        .ignoreCaret()
      if (scrollRootElement) {
        _checkSettings.scrollRootElement(scrollRootElement)
      }
      if (ignoreRegion) {
        _checkSettings.ignoreRegions(_makeRegionLocator(ignoreRegion))
      }
      if (floatingRegion) {
        _checkSettings.floatingRegion(
          _makeRegionLocator(floatingRegion.target),
          floatingRegion.maxUp,
          floatingRegion.maxDown,
          floatingRegion.maxLeft,
          floatingRegion.maxRight,
        )
      }
      await eyes.check(undefined, _checkSettings)
    }
  }

  async function close(options) {
    await eyes.close(options)
  }

  async function scrollDown(pixels) {
    await driver.executeScript(`window.scrollBy(0,${pixels})`)
  }

  async function switchToFrame(locator) {
    await driver.switchTo().frame(locator)
  }

  async function type(locator, inputText) {
    await driver.findElement(By.css(locator)).sendKeys(inputText)
  }

  async function abort() {
    await eyes.abortIfNotClosed()
  }

  async function cleanup() {
    await driver.close()
    await abort()
  }

  return {
    abort,
    visit,
    open,
    checkFrame,
    checkRegion,
    checkWindow,
    close,
    scrollDown,
    switchToFrame,
    type,
    cleanup,
  }
}

module.exports = {
  name: sdkName,
  initialize,
  supportedTests,
}
