const throat = require('throat')

/*
 * check command assumptions:
 * - The fluent API is used by default
 * - A full check window is performed unless otherwise specified
 */
function makeCoverageTests({visit, open, checkRegion, checkWindow, close}) {
  const url = 'https://applitools.github.io/demo/TestPages/FramesTestPage/'
  const viewportSize = '1024x768'
  const throwException = true

  return {
    checkRegionClassic: async () => {
      await visit(url)
      await open({viewportSize})
      await checkRegion({locator: '#overflowing-div', isClassicApi: true})
      await close(throwException)
    },
    checkRegionFluent: async () => {
      await visit(url)
      await open({viewportSize})
      await checkRegion({locator: '#overflowing-div'})
      await close(throwException)
    },
    checkWindowClassic: async () => {
      await visit(url)
      await open({viewportSize})
      await checkWindow({isClassicApi: true})
      await close(throwException)
    },
    checkWindowFluent: async () => {
      await visit(url)
      await open({viewportSize})
      await checkWindow()
      await close(throwException)
    },
  }
}

/**
 * Creates a coverage-test runner for a given SDK implementation.
 * sdkName: a string of the SDK name to display in the console output during a run
 * intialize: a function that initializeSdkImplementations state and implements all coverage-test DSL functions for a given SDK. Returns all of the functions expected by makeCoverageTests (e.g., visit, open, check, and close) plus optional functions the runner can use for lifecycle management (e.g., cleanup)
 * returns: a runTests function
 */
function makeRunTests(sdkName, initializeSdkImplementation) {
  const p = []
  const e = {}

  /**
   * Runs coverage-tests for a given SDK implementation with various execution modes.
   * supportedTests: an array of objects, each with keys of "name" and "executionMode"
   * - name: name of a test (found in makeCoverageTests)
   * - executionMode: e.g., {isVisualGrid: true} -- although an SDK can implement whatever it needs, just so long as it is what the initializeSdkImplementation function is using internally
   * options: an object which can be used to alter the behavior of runTests (e.g., set the concurrency limit, provide a different logger, etc.)
   */
  async function runTests(
    supportedTests,
    {
      log = msg => {
        console.log(msg)
      },
      concurrency = 10,
    } = {},
  ) {
    log(`Coverage Tests are running for ${sdkName}...`)

    supportedTests.forEach(supportedTest => {
      // store the displayName for consistent naming in both the console error output and in the Eyes dashboard
      supportedTest.displayName = `${supportedTest.name} with ${
        Object.keys(supportedTest.executionMode)[0]
      }`
      p.push(async () => {
        try {
          const sdkImplementation = await initializeSdkImplementation(supportedTest)
          const test = makeCoverageTests(sdkImplementation)[supportedTest.name]
          await test()
          if (sdkImplementation.cleanup) await sdkImplementation.cleanup()
        } catch (error) {
          recordError(e, supportedTest.displayName, error)
        }
      })
    })

    const start = new Date()
    await Promise.all(p.map(throat(concurrency, testRun => testRun())))
    const end = new Date()

    reportResults({log, p, e, start, end})
  }

  return {runTests}
}

function recordError(e, displayName, error) {
  if (!e[displayName]) {
    e[displayName] = []
  }
  e[displayName].push(error)
}

function reportResults({log, p, e, start, end}) {
  // logging
  if (Object.keys(e).length) {
    log(`-------------------- ERRORS --------------------`)
    log(e)
  }
  log(`-------------------- SUMMARY --------------------`)
  log(`Ran ${p.length} tests in ${end - start}ms`)
  if (Object.keys(e).length) {
    log(`Encountered n errors in ${Object.keys(e).length} tests`)
  }
}

module.exports = {makeCoverageTests, makeRunTests}
