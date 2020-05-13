'use strict'
const {makeEmitTracker} = require('@applitools/sdk-coverage-tests')

function makeRegionLocator(target) {
  return typeof target === 'string'
    ? `By.css('${target}')`
    : `new Region(${JSON.stringify(target)})`
}

class GenericTestController {
  constructor() {
    this._result = makeEmitTracker()
    this._result.storeHook('deps', `const {remote} = require('webdriverio')`)
    this._result.storeHook(
      'deps',
      `const {
      By,
      Eyes,
      BatchInfo,
      RectangleSize,
      StitchMode,
      VisualGridRunner,
      Target,
      Region,
      FileLogHandler,
    } = require('../../../index')`,
    )
    this._result.storeHook('deps', `const path = require('path')`)
    this._result.storeHook('vars', 'let eyes')
    this._result.storeHook('vars', 'let driver')
    this._result.storeHook('vars', 'let runner')
  }
  async setup(options) {
    this._baselineName = options.baselineName
    this._result.storeHook(
      'beforeEach',
      `const browserOptions = {
        logLevel: 'error',
        desiredCapabilities: {
          browserName: 'chrome',
          'goog:chromeOptions': {
            args: ['--headless'],
          },
        },
      }`,
    )
    this._result.storeHook('beforeEach', `driver = remote(browserOptions)`)
    this._result.storeHook('beforeEach', `await driver.init()`)
    this._result.storeHook(
      'beforeEach',
      `runner = ${
        options.executionMode.isVisualGrid ? 'runner = new VisualGridRunner(10)' : undefined
      }`,
    )
    this._result.storeHook(
      'beforeEach',
      `eyes = ${options.executionMode.isVisualGrid ? 'new Eyes(runner)' : 'new Eyes()'}`,
    )
    this._result.storeHook(
      'beforeEach',
      `${options.executionMode.isCssStitching ? 'eyes.setStitchMode(StitchMode.CSS)' : undefined}`,
    )
    this._result.storeHook(
      'beforeEach',
      `${
        options.executionMode.isScrollStitching
          ? 'eyes.setStitchMode(StitchMode.SCROLL)'
          : undefined
      }`,
    )
    this._result.storeHook('beforeEach', `eyes.setBranchName('${options.branchName}')`)
    if (!options.executionMode.isVisualGrid) {
      this._result.storeHook('beforeEach', `eyes.setHideScrollbars(true)`)
    }
    if (process.env.APPLITOOLS_SHOW_LOGS) {
      this._result.storeHook('beforeEach', `const logsFolder = path.resolve(__dirname, 'logs')`)
      this._result.storeHook(
        'beforeEach',
        `const logHandler = new FileLogHandler(
        true,
        path.resolve(logsFolder, '${this._baselineTestName}.log'),
        false,
      )`,
      )
      this._result.storeHook('beforeEach', `logHandler.open()`)
      this._result.storeHook('beforeEach', `eyes.setLogHandler(logHandler)`)
    }
    if (process.env.APPLITOOLS_API_KEY_SDK) {
      this._result.storeHook('beforeEach', 'eyes.setApiKey(process.env.APPLITOOLS_API_KEY_SDK)')
    }
  }
  async cleanup() {
    this._result.storeHook('afterEach', 'await driver.end()')
  }
  async open({appName, viewportSize}) {
    this._result.storeCommand(
      `await eyes.open(driver, '${appName}', '${this._baselineTestName}', RectangleSize.parse('${viewportSize}'))`,
    )
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
      this._result.storeCommand(
        `await eyes.checkWindow(${tag ? '"' + tag + '"' : undefined}, ${matchTimeout}, ${isFully})`,
      )
    } else {
      this._result.storeCommand(`{`)
      this._result.storeCommand(
        `let _checkSettings = Target.window()
        .fully(${isFully})
        .ignoreCaret()`,
      )
      if (scrollRootElement) {
        this._result.storeCommand(
          `_checkSettings.scrollRootElement(By.css('${scrollRootElement}'))`,
        )
      }
      if (ignoreRegion) {
        this._result.storeCommand(
          `_checkSettings.ignoreRegions(${makeRegionLocator(ignoreRegion)})`,
        )
      }
      if (floatingRegion) {
        this._result.storeCommand(`
        _checkSettings.floatingRegion(
          ${makeRegionLocator(floatingRegion.target)},
          ${floatingRegion.maxUp},
          ${floatingRegion.maxDown},
          ${floatingRegion.maxLeft},
          ${floatingRegion.maxRight},
        )`)
      }
      this._result.storeCommand(`await eyes.check(undefined, _checkSettings)`)
      this._result.storeCommand(`}`)
    }
  }
  async checkRegion(
    target,
    {isClassicApi = false, isFully = false, inFrame, ignoreRegion, tag, matchTimeout} = {},
  ) {
    if (isClassicApi) {
      inFrame
        ? this._result.storeCommand(
            `await eyes.checkRegionInFrame(By.css('${inFrame}'), By.css('${target}'), ${matchTimeout}, ${
              tag ? '"' + tag + '"' : undefined
            }, ${isFully})`,
          )
        : this._result.storeCommand(
            `await eyes.checkRegion(By.css('${target}'), ${matchTimeout}, ${
              tag ? '"' + tag + '"' : undefined
            })`,
          )
    } else {
      this._result.storeCommand(`{`)
      this._result.storeCommand(`let _checkSettings`)
      if (inFrame) this._result.storeCommand(`_checkSettings = Target.frame(By.css('${inFrame}'))`)
      if (Array.isArray(target)) {
        target.forEach((entry, index) => {
          index === 0
            ? this._result.storeCommand(
                `(_checkSettings = Target.region(${makeRegionLocator(entry)}))`,
              )
            : this._result.storeCommand(`_checkSettings.region(${makeRegionLocator(entry)})`)
        })
      } else {
        this._result.storeCommand(`_checkSettings
          ? _checkSettings.region(${makeRegionLocator(target)})
          : (_checkSettings = Target.region(${makeRegionLocator(target)}))`)
      }
      if (ignoreRegion) {
        this._result.storeCommand(
          `_checkSettings.ignoreRegions(${makeRegionLocator(ignoreRegion)})`,
        )
      }
      this._result.storeCommand(`_checkSettings.fully(${isFully})`)
      this._result.storeCommand(
        `await eyes.check(${tag ? '"' + tag + '"' : undefined}, _checkSettings)`,
      )
      this._result.storeCommand(`}`)
    }
  }
  async checkFrame(target, {isClassicApi = false, isFully = false, tag, matchTimeout} = {}) {
    if (isClassicApi) {
      this._result.storeCommand(
        `await eyes.checkFrame(By.css('${target}'), ${matchTimeout}, ${
          tag ? '"' + tag + '"' : undefined
        })`,
      )
    } else {
      this._result.storeCommand(`{`)
      this._result.storeCommand(`let _checkSettings`)
      if (Array.isArray(target)) {
        target.forEach((entry, index) => {
          index === 0
            ? this._result.storeCommand(`(_checkSettings = Target.frame(By.css('${entry}')))`)
            : this._result.storeCommand(`_checkSettings.frame(By.css('${entry}'))`)
        })
      } else {
        this._result.storeCommand(`_checkSettings = Target.frame(By.css('${target}'))`)
      }
      this._result.storeCommand(`_checkSettings.fully(${isFully})`)
      this._result.storeCommand(
        `await eyes.check(${tag ? '"' + tag + '"' : undefined}, _checkSettings)`,
      )
      this._result.storeCommand(`}`)
    }
  }
  async close(throwEx) {
    this._result.storeCommand(`await eyes.close(${throwEx})`)
  }
  async abort() {
    this._result.storeCommand('await eyes.abortIfNotClosed()')
  }
  async getAllTestResults() {
    this._result.storeCommand(`const resultsSummary = await runner.getAllTestResults()`)
    this._result.storeCommand(`const allResults = resultsSummary.getAllResults()`)
  }
  async visit(url) {
    this._result.storeCommand(`await driver.url('${url}')`)
  }
  async type(selector, text) {
    this._result.storeCommand(`await driver.setValue('${selector}', '${text}')`)
  }
  async switchToFrame(selector) {
    this._result.storeCommand(`await driver.frame(By.css('${selector}'))`)
  }
  async scrollDown(pixels) {
    this._result.storeCommand(`await driver.execute('window.scrollBy(0,${pixels})')`)
  }
}

module.exports = GenericTestController
