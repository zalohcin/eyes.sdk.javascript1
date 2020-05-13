'use strict'
const {remote} = require('webdriverio')
const {
  StitchMode,
  RectangleSize,
  VisualGridRunner,
  ClassicRunner,
  Eyes,
  Target,
  By,
} = require('../../index')

class CustomTestController {
  async setup(options) {
    this._baselineName = options.baselineName
    this._driver = remote({
      logLevel: 'error',
      desiredCapabilities: options.capabilities,
    })
    await this._driver.init()
    this._runner = options.isVisualGrid ? new VisualGridRunner(10) : new ClassicRunner()
    this._eyes = new Eyes(this._runner)
    if (options.isCssStitching) {
      this._eyes.setStitchMode(StitchMode.CSS)
    } else if (options.isScrollStitching) {
      this._eyes.setStitchMode(StitchMode.SCROLL)
    }
    if (options.batch) {
      this._eyes.setBatch(options.batch)
    }
    if (options.branchName) {
      this._eyes.setBranchName(options.branchName)
    }
    this._eyes.setHideScrollbars(options.hideScrollbars)
  }
  async cleanup() {
    await this._driver.end()
  }
  async open({appName, testName, viewportSize}) {
    if (typeof viewportSize === 'string') {
      viewportSize = RectangleSize.parse(viewportSize)
    }
    return this._eyes.open(this._driver, appName, testName, viewportSize)
  }
  async checkWindow({
    isClassicApi = false,
    isFully = false,
    ignoreRegion,
    floatingRegion,
    scrollRootElement,
    tag,
    matchTimeout,
  } = {}) {
    if (isClassicApi) {
      await this._eyes.checkWindow(tag, matchTimeout, isFully)
    } else {
      const checkSettings = Target.window()
        .fully(isFully)
        .ignoreCaret()
      if (scrollRootElement) {
        checkSettings.scrollRootElement(scrollRootElement)
      }
      if (ignoreRegion) {
        checkSettings.ignoreRegions(ignoreRegion)
      }
      if (floatingRegion) {
        checkSettings.floatingRegion(
          floatingRegion.target,
          floatingRegion.maxUp,
          floatingRegion.maxDown,
          floatingRegion.maxLeft,
          floatingRegion.maxRight,
        )
      }
      await this._eyes.check(undefined, checkSettings)
    }
  }
  async checkRegion(
    target,
    {isClassicApi = false, isFully = false, inFrame, ignoreRegion, tag, matchTimeout} = {},
  ) {
    if (isClassicApi) {
      if (inFrame) {
        await this._eyes.checkRegionInFrame(inFrame, target, matchTimeout, tag, isFully)
      } else {
        await this._eyes.checkRegion(target, matchTimeout, tag)
      }
    } else {
      let checkSettings = Target
      if (Array.isArray(inFrame)) {
        checkSettings = inFrame.reduce(
          (checkSettings, frame) => checkSettings.frame(frame),
          checkSettings,
        )
      } else {
        checkSettings = checkSettings.frame(inFrame)
      }
      if (target) {
        checkSettings = checkSettings.region(target)
      }
      if (ignoreRegion) {
        checkSettings.ignoreRegions(ignoreRegion)
      }
      checkSettings.fully(isFully)
      await this._eyes.check(tag, checkSettings)
    }
  }
  async checkFrame(target, {isClassicApi = false, isFully = false, tag, matchTimeout} = {}) {
    if (isClassicApi) {
      await this._eyes.checkFrame(target, matchTimeout, tag)
    } else {
      let checkSettings = Target
      if (Array.isArray(target)) {
        checkSettings = target.reduce(
          (checkSettings, frame) => checkSettings.frame(frame),
          checkSettings,
        )
      } else {
        checkSettings = Target.frame(target)
      }
      checkSettings.fully(isFully)
      await this._eyes.check(tag, checkSettings)
    }
  }
  async close(throwEx) {
    await this._eyes.close(throwEx)
  }
  async abort() {
    await this._eyes.abortIfNotClosed()
  }
  async getAllTestResults() {
    return this._runner.getAllTestResults().getAllResults()
  }
  async visit(url) {
    await this._driver.url(url)
  }
  async type(selector, text) {
    await this._driver.setValue(selector, text)
  }
  async switchToFrame(selector, driver = this._driver) {
    if (selector instanceof By) {
      selector = `${selector.using}:${selector.value}`
    }
    let frame = null
    if (selector) {
      const {value} = await driver.$(selector)
      frame = value
    }
    await driver.frame(frame)
  }
  async executeScript(script, args = [], driver = this._driver) {
    const {value} = await driver.execute(script, ...args)
    return value
  }
  async findElement(selector, driver = this._driver) {
    if (selector instanceof By) {
      selector = `${selector.using}:${selector.value}`
    }
    const {value} = await driver.$(selector)
    return value
  }
  async scrollDown(pixels) {
    await this._driver.execute(`window.scrollBy(0, ${pixels})`)
  }
}

module.exports = CustomTestController
