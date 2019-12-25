const throat = require('throat')

/*
 * check command assumptions:
 * - The fluent API is used by default
 * - A viewport check window is performed unless otherwise specified
 * - locators are specified with CSS selectors
 */
function makeCoverageTests({visit, open, checkFrame, checkRegion, checkWindow, close}) {
  const url = 'https://applitools.github.io/demo/TestPages/FramesTestPage/'
  const viewportSize = '700x460'
  const throwException = true

  return {
    TestCheckFrame: async () => {
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Classic API', viewportSize})
      await checkFrame({locator: 'iframe[name="frame1"]', isClassicApi: true})
      await close(throwException)
    },
    TestCheckRegion: async () => {
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Classic API', viewportSize})
      await checkRegion({locator: '#overflowing-div', isClassicApi: true})
      await close(throwException)
    },
    TestCheckRegion2: async () => {
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Classic API', viewportSize})
      await checkRegion({locator: '#overflowing-div-image', isClassicApi: true})
      await close(throwException)
    },
    TestCheckWindow: async () => {
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Classic API', viewportSize})
      await checkWindow({isClassicApi: true})
      await close(throwException)
    },
    TestCheckWindowFully: async () => {
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Classic API', viewportSize})
      await checkWindow({isClassicApi: true, isFully: true})
      await close(throwException)
    },
    TestCheckFrame_Fluent: async () => {
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      await checkFrame({locator: 'iframe[name="frame1"]'})
      await close(throwException)
    },
    TestCheckWindow_Fluent: async () => {
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      await checkWindow()
      await close(throwException)
    },
  }
}

/**
 * Creates a coverage-test runner for a given SDK implementation.
 * params:
 * - sdkName: string of the SDK name
 * - intializeSdkImplementation: a function that initializes state and implements
 *     all coverage-test DSL functions for a given SDK. Returns all of the functions
 *     expected by makeCoverageTests (e.g., visit, open, check, and close) plus
 *     optional functions the runner can use for lifecycle management (e.g., cleanup)
 * returns: a runTests function
 */
function makeRunTests(sdkName, initializeSdkImplementation) {
  const p = []
  const e = {}

  /**
   * Runs coverage-tests for a given SDK implementation.
   * params:
   * - supportedTests: an array of objects, each with keys of "name" and "executionMode"
   *    - name: name of a test (found in makeCoverageTests)
   *    - executionMode: e.g., {isVisualGrid: true} -- although an SDK can implement
   *        whatever it needs, just so long as it is what the initializeSdkImplementation
   *        function is using internally
   * - options: an object which can be used to alter the behavior of runTests
   *    - host: url to run tests on (e.g., a Selenium Grid)
   *    - concurrency: number of parallel executions at one time
   * returns: a report object
   */
  async function runTests(supportedTests, {branchName = 'master', concurrency = 15, host} = {}) {
    supportedTests.forEach(supportedTest => {
      const testName = supportedTest.name
      const executionMode = supportedTest.executionMode
      p.push(async () => {
        let sdkImplementation
        try {
          sdkImplementation = await initializeSdkImplementation({
            // for consistent naming in the Eyes dashboard to pick up the correct baselines
            baselineTestName: `${testName}${convertExecutionModeToSuffix(executionMode)}`,
            branchName,
            host,
            ...supportedTest,
          })
          const test = makeCoverageTests(sdkImplementation)[testName]
          await test()
        } catch (error) {
          recordError(e, error, testName, executionMode)
        } finally {
          if (sdkImplementation.cleanup) await sdkImplementation.cleanup()
        }
      })
    })
    process.on('unhandledRejection', (reason, _promise) => {
      delete reason.remoteStacktrace
      recordError(e, `Unhandled Rejections`, reason)
    })
    const start = new Date()
    await Promise.all(p.map(throat(concurrency, testRun => testRun())))
    const end = new Date()

    return makeReport({sdkName, testsRan: supportedTests, p, e, start, end})
  }

  return {runTests}
}

function convertExecutionModeToSuffix(executionMode) {
  switch (getNameFromObject(executionMode)) {
    case 'isVisualGrid':
      return '_VG'
    case 'isScrollStitching':
      return '_Scroll'
    default:
      return ''
  }
}

function convertExecutionModeToBareName(executionMode) {
  return getNameFromObject(executionMode)
    .replace(/^is/, '')
    .replace(/stitching$/i, '')
    .toLowerCase()
}

function convertSdkNameToReportName(sdkName) {
  switch (sdkName) {
    case 'eyes-selenium':
      return 'js_selenium_4'
    case 'eyes.selenium':
      return 'js_selenium_3'
    case 'eyes.webdriverio.javascript5':
      return 'js_wdio_5'
    case 'eyes.webdriverio.javascript4':
      return 'js_wdio_4'
    case 'eyes-images':
      return 'js_images'
    default:
      throw 'Unsupported SDK'
  }
}

function getNameFromObject(object) {
  return Object.keys(object)[0]
}

function hasPassed(errors, testName, executionMode) {
  return !(errors[testName] && !!errors[testName][getNameFromObject(executionMode)])
}

function makeReport({sdkName, testsRan, p, e, start, end}) {
  const hasErrors = Object.keys(e).length
  let report = {
    summary: [],
    errors: e,
    toSendReportSchema: () => {
      return {
        sdk: convertSdkNameToReportName(sdkName),
        group: 'selenium', // TODO: make dynamic
        sandbox: true,
        results: testsRan.map(test => {
          return {
            test_name: test.name,
            parameters: {
              browser: 'chrome',
              mode: convertExecutionModeToBareName(test.executionMode),
            },
            passed: hasPassed(e, test.name, test.executionMode),
          }
        }),
      }
    },
  }
  report.summary.push(`Ran ${p.length} tests in ${end - start}ms`)
  if (hasErrors) {
    report.summary.push(`Encountered n errors in ${Object.keys(e).length} tests`)
  }
  return {report}
}

function recordError(errors, error, testName, executionMode) {
  if (!errors[testName]) {
    errors[testName] = {}
  }
  executionMode
    ? (errors[testName][getNameFromObject(executionMode)] = error)
    : (errors[testName] = error)
}

module.exports = {makeCoverageTests, makeRunTests}
