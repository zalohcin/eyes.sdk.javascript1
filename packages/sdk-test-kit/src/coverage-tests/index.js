/*
 * check command assumptions:
 * - The fluent API is used by default
 * - A full check window is performed unless otherwise specified
 */

function makeCoverageTests({visit, open, check, close}) {
  const url = 'https://applitools.github.io/demo/TestPages/FramesTestPage/'
  const appName = 'coverageTests'
  const viewportSize = '1024x768'
  const throwException = true
  const executionModes = [{isVisualGrid: true}, {isCssStitching: true}, {isScrollStitching: true}]

  return {
    checkRegionClassic: {
      executionModes,
      run: async context => {
        await visit(context, url)
        await open(context, {appName, testName: 'checkRegionClassic', viewportSize})
        await check(context, {
          isClassicApi: true,
          locator: '#overflowing-div',
        })
        await close(context, throwException)
      },
    },
    checkRegionFluent: {
      executionModes,
      run: async context => {
        await visit(context, url)
        await open(context, {appName, testName: 'checkRegionFluent', viewportSize})
        await check(context, {
          locator: '#overflowing-div',
        })
        close(context, throwException)
      },
    },
    checkWindowClassic: {
      executionModes,
      run: async context => {
        await visit(context, url)
        await open(context, {appName, testName: 'checkWindowClassic', viewportSize})
        await check(context, {
          isClassicApi: true,
        })
        await close(context, throwException)
      },
    },
    checkWindowFluent: {
      executionModes,
      run: async context => {
        await visit(context, url)
        await open(context, {appName, testName: 'checkWindowFluent', viewportSize})
        await check(context)
        await close(context, throwException)
      },
    },
  }
}

async function runCoverageTests({initialize, visit, open, check, close}, supportedTests) {
  // init
  console.log(`Coverage Tests are running...`)
  const tests = makeCoverageTests({visit, open, check, close})
  const p = []
  const e = {}

  // execution loop
  for (const index in supportedTests) {
    const test = tests[supportedTests[index]]
    test.name = supportedTests[index]
    for (const index in test.executionModes) {
      const executionMode = test.executionModes[index]
      p.push(async () => {
        await test.run(await initialize(executionMode)).catch(error => {
          const testName = `${test.name} with ${Object.keys(executionMode)[0]}`
          if (!e[testName]) {
            e[testName] = []
          }
          e[testName].push(error)
        })
      })
    }
  }
  const start = new Date()
  await Promise.all(p.map(testRun => testRun()))
  const end = new Date()

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

module.exports = {makeCoverageTests, runCoverageTests}
