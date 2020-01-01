/// <reference path="../../../sdk-test-kit/src/coverage-tests/api.ts" />
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

  function initialize() {
    let eyes
    let driver
    let runner
    let baselineTestName

    let _setup: Hooks.Setup = async function (options) {
      baselineTestName = options.baselineTestName
      driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(new ChromeOptions().headless())
        .usingServer(options.host)
        .build()
      runner = options.executionMode.isVisualGrid ? (runner = new VisualGridRunner(10)) : undefined
      eyes = options.executionMode.isVisualGrid ? new Eyes(runner) : new Eyes()
      options.executionMode.isCssStitching ? eyes.setStitchMode(StitchMode.CSS) : undefined
      options.executionMode.isScrollStitching ? eyes.setStitchMode(StitchMode.SCROLL) : undefined
      eyes.setBranchName(options.branchName)
      eyes.setBatch(batch)
    }

    let _cleanup: Hooks.Cleanup = async function () {
      await driver.close()
      await abort()
    }

    let visit: EyesApi.Visit = async function (url: string) {
      await driver.get(url)
    }

    let open: EyesApi.Open = async function ({appName, viewportSize}) {
      driver = await eyes.open(driver, appName, baselineTestName, RectangleSize.parse(viewportSize))
    }

    let checkFrame: EyesApi.CheckFrame = async function (
      target,
      options,
    ) {
      if (options.isClassicApi) {
        await eyes.checkFrame(By.css(target), options.matchTimeout, options.tag)
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
        _checkSettings.fully(options.isFully)
        await eyes.check(options.tag, _checkSettings)
      }
    }

    let checkRegion: EyesApi.CheckRegion = async function (
      target,
      options
    ) {
      if (options.isClassicApi) {
        options.inFrame
          ? await eyes.checkRegionInFrame(By.css(options.inFrame), By.css(target), options.matchTimeout, options.tag, options.isFully)
          : await eyes.checkRegionBy(By.css(target), options.tag, options.matchTimeout, options.isFully)
      } else {
        let _checkSettings
        if (options.inFrame) _checkSettings = Target.frame(By.css(options.inFrame))
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
        if (options.ignoreRegion) {
          _checkSettings.ignoreRegions(_makeRegionLocator(options.ignoreRegion))
        }
        _checkSettings.fully(options.isFully)
        await eyes.check(options.tag, _checkSettings)
      }
    }

    const _makeRegionLocator = target => {
      if (typeof target === 'string') return By.css(target)
      else if (typeof target === 'number') return target
      else return new Region(target)
    }

    let checkWindow: EyesApi.CheckWindow = async function (options) {
      if (options.isClassicApi) {
        await eyes.checkWindow(options.tag, options.matchTimeout, options.isFully)
      } else {
        let _checkSettings = Target.window()
          .fully(options.isFully)
          .ignoreCaret()
        if (options.scrollRootElement) {
          _checkSettings.scrollRootElement(By.css(options.scrollRootElement))
        }
        if (options.ignoreRegion) {
          _checkSettings.ignoreRegions(_makeRegionLocator(options.ignoreRegion))
        }
        if (options.floatingRegion) {
          _checkSettings.floatingRegion(
            _makeRegionLocator(options.floatingRegion.target),
            options.floatingRegion.maxUp,
            options.floatingRegion.maxDown,
            options.floatingRegion.maxLeft,
            options.floatingRegion.maxRight,
          )
        }
        await eyes.check(options.tag, _checkSettings)
      }
    }

    const close: EyesApi.Close = async function (options) {
      await eyes.close(options)
    }

    const scrollDown: EyesApi.ScrollDown = async function (pixels) {
      await driver.executeScript(`window.scrollBy(0,${pixels})`)
    }

    const switchToFrame: EyesApi.SwitchToFrame = async function (selector) {
      const element = await driver.findElement(By.css(selector))
      await driver.switchTo().frame(element)
    }

    const type: EyesApi.Type = async function (selector, inputText) {
      await driver.findElement(By.css(selector)).sendKeys(inputText)
    }

    const abort: EyesApi.Abort = async function () {
      await eyes.abortIfNotClosed()
    }

    return {
      _setup,
      _cleanup,
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
    }
  }

  module.exports = {
    name: sdkName,
    initialize,
    supportedTests,
  }
