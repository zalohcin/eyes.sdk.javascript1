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

  function initialize({baselineTestName, branchName, executionMode, host}) {
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

    let visit: EyesApi.Visit = async function visit(url: string) {
      await driver.get(url)
    }

    let open: EyesApi.Open = async function open({appName, viewportSize}) {
      driver = await eyes.open(driver, appName, baselineTestName, RectangleSize.parse(viewportSize))
    }

    let checkFrame: EyesApi.CheckFrame = async function checkFrame(
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

    let checkRegion: EyesApi.CheckRegion = async function checkRegion(
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

    let checkWindow: EyesApi.CheckWindow = async function checkWindow(options) {
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

    const close: EyesApi.Close = async function close(options) {
      await eyes.close(options)
    }

    const scrollDown: EyesApi.ScrollDown = async function scrollDown(pixels) {
      await driver.executeScript(`window.scrollBy(0,${pixels})`)
    }

    const switchToFrame: EyesApi.SwitchToFrame = async function switchToFrame(selector) {
      const element = await driver.findElement(By.css(selector))
      await driver.switchTo().frame(element)
    }

    const type: EyesApi.Type = async function type(selector, inputText) {
      await driver.findElement(By.css(selector)).sendKeys(inputText)
    }

    const abort: EyesApi.Abort = async function abort() {
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
