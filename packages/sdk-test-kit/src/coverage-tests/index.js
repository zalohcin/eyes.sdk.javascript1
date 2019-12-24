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
      await open({viewportSize})
      await checkFrame({locator: 'iframe[name="frame1"]', isClassicApi: true})
      await close(throwException)
    },
    TestCheckRegion: async () => {
      await visit(url)
      await open({viewportSize})
      await checkRegion({locator: '#overflowing-div', isClassicApi: true})
      await close(throwException)
    },
    TestCheckRegion2: async () => {
      await visit(url)
      await open({viewportSize})
      await checkRegion({locator: '#overflowing-div-image', isClassicApi: true})
      await close(throwException)
    },
    TestCheckWindow: async () => {
      await visit(url)
      await open({viewportSize})
      await checkWindow({isClassicApi: true})
      await close(throwException)
    },
    TestCheckWindowFully: async () => {
      await visit(url)
      await open({viewportSize})
      await checkWindow({isClassicApi: true, isFully: true})
      await close(throwException)
    },
    TestCheckFrame_Fluent: async () => {
      await visit(url)
      await open({viewportSize})
      await checkFrame({locator: 'iframe[name="frame1"]'})
      await close(throwException)
    },
    TestCheckRegion_Fluent: async () => {
      await visit(url)
      await open({viewportSize})
      await checkRegion({locator: '#overflowing-div'})
      await close(throwException)
    },
    TestCheckRegion2_Fluent: async () => {
      await visit(url)
      await open({viewportSize})
      await checkRegion({locator: '#overflowing-div-image'})
      await close(throwException)
    },
    TestCheckWindow_Fluent: async () => {
      await visit(url)
      await open({viewportSize})
      await checkWindow()
      await close(throwException)
    },
  }
}

function convertExecutionModeToSuffix(executionModeName) {
  switch (executionModeName) {
    case 'isVisualGrid':
      return '_VG'
    case 'isScrollStitching':
      return '_Scroll'
    default:
      return ''
  }
}

/**
 * Creates a coverage-test runner for a given SDK implementation.
 * intializeSdkImplementation: a function that initializes state and implements all coverage-test DSL functions for a given SDK. Returns all of the functions expected by makeCoverageTests (e.g., visit, open, check, and close) plus optional functions the runner can use for lifecycle management (e.g., cleanup)
 * returns: a runTests function
 */
function makeRunTests(initializeSdkImplementation) {
  const p = []
  const e = {}

  /**
   * Runs coverage-tests for a given SDK implementation with various execution modes.
   * supportedTests: an array of objects, each with keys of "name" and "executionMode"
   * - name: name of a test (found in makeCoverageTests)
   * - executionMode: e.g., {isVisualGrid: true} -- although an SDK can implement whatever it needs, just so long as it is what the initializeSdkImplementation function is using internally
   * options: an object which can be used to alter the behavior of runTests (e.g., set the concurrency limit, provide a different logger, etc.)
   */
  async function runTests(supportedTests, {concurrency = 15} = {}) {
    supportedTests.forEach(supportedTest => {
      const testName = supportedTest.name
      const executionModeName = Object.keys(supportedTest.executionMode)[0]
      // store the displayName for consistent naming in the Eyes dashboard to pick up the correct baselines
      supportedTest.displayName = `${testName}${convertExecutionModeToSuffix(executionModeName)}`
      p.push(async () => {
        try {
          const sdkImplementation = await initializeSdkImplementation(supportedTest)
          const test = makeCoverageTests(sdkImplementation)[testName]
          await test()
          if (sdkImplementation.cleanup) await sdkImplementation.cleanup()
        } catch (error) {
          recordError(e, error, testName, executionModeName)
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

    return makeReport({p, e, start, end})
  }

  return {runTests}
}

function recordError(errors, error, testName, executionModeName) {
  if (!errors[testName]) {
    errors[testName] = {}
  }
  errors[testName][executionModeName] = error
}

function makeReport({p, e, start, end}) {
  const hasErrors = Object.keys(e).length
  let report = {
    summary: [],
    errors: e,
  }
  report.summary.push(`-------------------- SUMMARY --------------------`)
  report.summary.push(`Ran ${p.length} tests in ${end - start}ms`)
  if (hasErrors) {
    report.summary.push(`Encountered n errors in ${Object.keys(e).length} tests`)
  }
  return {report}
}

module.exports = {makeCoverageTests, makeRunTests}
