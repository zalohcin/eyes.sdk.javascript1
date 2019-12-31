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

  async function _setup() {
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
  }

  async function _cleanup() {
    await driver.close()
    await abort()
  }

  async function visit(url) {
    await driver.get(url)
  }

  async function open({appName, viewportSize}) {
    driver = await eyes.open(driver, appName, baselineTestName, RectangleSize.parse(viewportSize))
  }

  async function checkFrame(
    target,
    {isClassicApi = false, isFully = false, tag, matchTimeout} = {},
  ) {
    if (isClassicApi) {
      await eyes.checkFrame(By.css(target), matchTimeout, tag)
    } else {
      let _checkSettings
      if (Array.isArray(target)) {
        target.forEach((entry, index) => {
          index === 0
            ? (_checkSettings = Target.frame(By.css(entry)))
            : _checkSettings.frame(By.css(entry))
        })
      } else {
        _checkSettings = Target.frame(By.css(target))
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
      if (inFrame) _checkSettings = Target.frame(By.css(inFrame))
      if (Array.isArray(target)) {
        target.forEach((entry, index) => {
          index === 0 && _checkSettings === undefined
            ? (_checkSettings = Target.region(_makeRegionLocator(entry)))
            : _checkSettings.region(_makeRegionLocator(entry))
        })
      } else {
        _checkSettings
          ? _checkSettings.region(_makeRegionLocator(target))
          : (_checkSettings = Target.region(_makeRegionLocator(target)))
      }
      if (ignoreRegion) {
        _checkSettings.ignoreRegions(_makeRegionLocator(ignoreRegion))
      }
      _checkSettings.fully(isFully)
      await eyes.check(tag, _checkSettings)
    }
  }

  const _makeRegionLocator = target => {
    if (typeof target === 'string') return By.css(target)
    else if (typeof target === 'number') return target
    else return new Region(target)
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
        _checkSettings.scrollRootElement(By.css(scrollRootElement))
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
    _cleanup,
    _setup,
  }
}

module.exports = {
  name: sdkName,
  initialize,
  supportedTests,
}
