const supportedTests = require('./supported-tests')
const {makeEmitTracker} = require('@applitools/sdk-coverage-tests')
const sdkName = 'eyes-selenium'

function initialize() {
  const result = makeEmitTracker()
  result.storeHook('deps', `const path = require('path')`)
  result.storeHook(
    'deps',
    `const specs = require(path.resolve(process.cwd(), 'src/SpecWrappedDriver'))`,
  )
  result.storeHook(
    'deps',
    `const {
      getEyes,
      Browsers
    } = require('@applitools/sdk-coverage-tests/coverage-tests/utils/TestSetup)`,
  )
  result.storeHook('vars', 'let eyes')
  result.storeHook('vars', 'let driver')
  result.storeHook('vars', 'let runner')
  result.storeHook('vars', 'let baselineTestName')

  function _setup(options) {
    result.storeHook('beforeEach', `baselineTestName = '${options.baselineTestName}'`)
    result.storeHook(
      'beforeEach',
      `driver = await specs.build({
        capabilities: Browsers.chrome(),
        serverUrl: ${options.host ? `'${options.host}'` : undefined},
        logLevel: 'error',
      })`,
    )
    result.storeHook(
      'beforeEach',
      `eyes = getEyes({
        isVisualGrid: ${options.executionMode.isVisualGrid},
        isCssStitching: ${options.executionMode.isCssStitching},
        branchName: '${options.branchName}',
      })`,
    )
    result.storeHook('beforeEach', `eyes.setMatchTimeout(0)`)
  }

  function _cleanup() {
    result.storeHook('afterEach', 'await specs.cleanup(driver)')
  }

  function abort() {
    result.storeCommand('eyes ? await eyes.abortIfNotClosed() : undefined')
  }

  function makeRegionLocator(target) {
    return typeof target === 'string'
      ? `specs.toSupportedSelector({type: 'css', selector: '${target}'})`
      : `new Region(${JSON.stringify(target)})`
  }

  function checkFrame(
    target,
    {isClassicApi = false, isFully = false, tag, matchTimeout = 0, isLayout, floatingRegion} = {},
  ) {
    if (isClassicApi) {
      result.storeCommand(
        `await eyes.checkFrame(
          ${makeRegionLocator(target)},
          ${matchTimeout},
          ${tag ? `'${tag}` : undefined},
        )`,
      )
    } else {
      result.storeCommand(`let checkSettings = Target`)
      if (Array.isArray(target)) {
        target.forEach(entry => {
          result.storeCommand(`checkSettings.frame(${makeRegionLocator(entry)})`)
        })
      } else {
        result.storeCommand(`checkSettings.frame(${makeRegionLocator(target)})`)
      }
      if (floatingRegion) {
        result.storeCommand(`checkSettings.floatingRegion(
          ${makeRegionLocator(floatingRegion.target)},
          ${floatingRegion.maxUp},
          ${floatingRegion.maxDown},
          ${floatingRegion.maxLeft},
          ${floatingRegion.maxRight},
        )`)
      }
      if (isLayout) {
        result.storeCommand(`checkSettings.layout()`)
      }
      result.storeCommand(`checkSettings.fully(${isFully}).timeout(${matchTimeout})`)
      result.storeCommand(`await eyes.check(${tag ? `'${tag}` : undefined}, checkSettings)`)
    }
  }

  function checkRegion(
    target,
    {
      floatingRegion,
      isClassicApi = false,
      isFully = false,
      inFrame,
      ignoreRegion,
      isLayout,
      matchTimeout = 0,
      tag,
    } = {},
  ) {
    if (isClassicApi) {
      inFrame
        ? result.storeCommand(
            `await eyes.checkRegionInFrame(By.css('${inFrame}'), By.css('${target}'), ${matchTimeout}, ${
              tag ? '"' + tag + '"' : undefined
            }, ${isFully})`,
          )
        : result.storeCommand(
            `await eyes.checkRegionBy(By.css('${target}'), ${
              tag ? '"' + tag + '"' : undefined
            }, ${matchTimeout}, ${isFully})`,
          )
    } else {
      result.storeCommand(`{`)
      result.storeCommand(`let _checkSettings`)
      if (inFrame) {
        result.storeCommand(`_checkSettings = Target.frame(By.css('${inFrame}'))`)
      }
      if (Array.isArray(target)) {
        target.forEach((entry, index) => {
          index === 0
            ? result.storeCommand(`(_checkSettings = Target.region(${makeRegionLocator(entry)}))`)
            : result.storeCommand(`_checkSettings.region(${makeRegionLocator(entry)})`)
        })
      } else {
        result.storeCommand(`_checkSettings
          ? _checkSettings.region(${makeRegionLocator(target)})
          : (_checkSettings = Target.region(${makeRegionLocator(target)}))`)
      }
      if (ignoreRegion) {
        result.storeCommand(`_checkSettings.ignoreRegions(${makeRegionLocator(ignoreRegion)})`)
      }
      if (floatingRegion) {
        result.storeCommand(
          `_checkSettings.floatingRegion(
            ${makeRegionLocator(floatingRegion.target)},
            ${floatingRegion.maxUp},
            ${floatingRegion.maxDown},
            ${floatingRegion.maxLeft},
            ${floatingRegion.maxRight},
          )`,
        )
      }
      if (isLayout) {
        result.storeCommand(`_checkSettings.layout()`)
      }
      result.storeCommand(`_checkSettings.fully(${isFully}).timeout(${matchTimeout})`)
      result.storeCommand(`await eyes.check(${tag ? '"' + tag + '"' : undefined}, _checkSettings)`)
      result.storeCommand(`}`)
    }
  }

  function checkWindow({
    isClassicApi = false,
    isFully = false,
    ignoreRegion,
    floatingRegion,
    scrollRootElement,
    tag,
    matchTimeout = 0,
  } = {}) {
    if (isClassicApi) {
      result.storeCommand(
        `await eyes.checkWindow(${tag ? '"' + tag + '"' : undefined}, ${matchTimeout}, ${isFully})`,
      )
    } else {
      result.storeCommand(`{`)
      result.storeCommand(
        `let _checkSettings = Target.window()
        .fully(${isFully})
        .ignoreCaret()
        .timeout(${matchTimeout})`,
      )
      if (scrollRootElement) {
        result.storeCommand(`_checkSettings.scrollRootElement(By.css('${scrollRootElement}'))`)
      }
      if (ignoreRegion) {
        result.storeCommand(`_checkSettings.ignoreRegions(${makeRegionLocator(ignoreRegion)})`)
      }
      if (floatingRegion) {
        result.storeCommand(`
        _checkSettings.floatingRegion(
          ${makeRegionLocator(floatingRegion.target)},
          ${floatingRegion.maxUp},
          ${floatingRegion.maxDown},
          ${floatingRegion.maxLeft},
          ${floatingRegion.maxRight},
        )`)
      }
      result.storeCommand(`await eyes.check(undefined, _checkSettings)`)
      result.storeCommand(`}`)
    }
  }

  function close(options) {
    result.storeCommand(`await eyes.close(${options})`)
  }

  function getAllTestResults() {
    result.storeCommand(`{`)
    result.storeCommand(`const resultsSummary = await runner.getAllTestResults()`)
    result.storeCommand(`resultsSummary = resultsSummary.getAllResults()`)
    result.storeCommand(`}`)
  }

  function open(options) {
    result.storeCommand(`await eyes.open(
      driver,
      '${options.appName}',
      baselineTestName,
      RectangleSize.parse('${options.viewportSize}'),
    )`)
  }

  function scrollDown(pixels) {
    result.storeCommand(`await driver.executeScript('window.scrollBy(0,${pixels})')`)
  }

  function switchToFrame(selector) {
    result.storeCommand(`{`)
    result.storeCommand(`const element = await driver.findElement(By.css('${selector}'))`)
    result.storeCommand(`await driver.switchTo().frame(element)`)
    result.storeCommand(`}`)
  }

  function type(locator, inputText) {
    result.storeCommand(`await driver.findElement(By.css('${locator}')).sendKeys('${inputText}')`)
  }

  function visit(url) {
    result.storeCommand(`await driver.get('${url}')`)
  }

  return {
    hooks: {
      beforeEach: _setup,
      afterEach: _cleanup,
    },
    out: result,
    abort,
    visit,
    open,
    checkFrame,
    checkRegion,
    checkWindow,
    close,
    getAllTestResults,
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
