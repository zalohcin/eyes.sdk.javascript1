/*
 * check command assumptions:
 * - The fluent API is used by default
 * - A full check window is performed unless otherwise specified
 */
function makeCoverageTests({visit, open, check, close}) {
  const url = 'https://applitools.github.io/demo/TestPages/FramesTestPage/'
  const viewportSize = '1024x768'
  const throwException = true

  return {
    checkRegionClassic: async () => {
      await visit(url)
      await open({viewportSize})
      await check({
        isClassicApi: true,
        locator: '#overflowing-div',
      })
      await close(throwException)
    },
    checkRegionFluent: async () => {
      await visit(url)
      await open({viewportSize})
      await check({
        locator: '#overflowing-div',
      })
      await close(throwException)
    },
    checkWindowClassic: async () => {
      await visit(url)
      await open({viewportSize})
      await check({
        isClassicApi: true,
      })
      await close(throwException)
    },
    checkWindowFluent: async () => {
      await visit(url)
      await open({viewportSize})
      await check()
      await close(throwException)
    },
  }
}

/**
 * Creates a coverage-test runner for a given SDK implementation.
 * sdkName: a string of the SDK name to display in the console output during a run
 * intialize: a function that initializes state and implements all DSL functions for a given SDK. Returns all of the functions expected by makeCoverageTests (see above) plus functions the runner expects for lifecycle management (e.g., beforeAll, afterAll, beforeEach, afterEach
 * returns: a run function
 */
function makeRun(sdkName, initialize) {
  const p = []
  const e = {}
  const {beforeAll, afterAll} = initialize()

  /**
   * Runs coverage-tests for a given SDK implementation with various execution modes.
   * supportedTests: an array of objects, each with keys of "name" and "executionMode"
   * - name: name of a test (found in makeCoverageTests)
   * - executionMode: e.g., {isVisualGrid: true} -- although an SDK can implement whatever it needs, just so long as it is what the initialize function is using internally
   */
  async function run(supportedTests) {
    const sharedContext = await beforeAll()

    console.log(`Coverage Tests are running for ${sdkName}...`)

    supportedTests.forEach(supportedTest => {
      supportedTest.displayName = `${supportedTest.name} with ${
        Object.keys(supportedTest.executionMode)[0]
      }`
      supportedTest.executionMode = {...supportedTest.executionMode, ...sharedContext}
      p.push(async () => {
        try {
          const implementation = await initialize(supportedTest)
          const test = makeCoverageTests(implementation)[supportedTest.name]
          await implementation.beforeEach()
          await test()
          await implementation.afterEach()
        } catch (error) {
          if (!e[supportedTest.displayName]) {
            e[supportedTest.displayName] = []
          }
          e[supportedTest.displayName].push(error)
        }
      })
    })

    const start = new Date()
    await Promise.all(p.map(testRun => testRun()))
    await afterAll(sharedContext)
    const end = new Date()

    reportResults({p, e, start, end})
  }

  return {run}
}

function reportResults({p, e, start, end}) {
  // logging
  if (Object.keys(e).length) {
    console.log(`-------------------- ERRORS --------------------`)
    console.log(e)
  }
  console.log(`-------------------- SUMMARY --------------------`)
  console.log(`Ran ${p.length} tests in ${end - start}ms`)
  if (Object.keys(e).length) {
    console.log(`Encountered n errors in ${Object.keys(e).length} tests`)
  }
}

module.exports = {makeCoverageTests, makeRun}
