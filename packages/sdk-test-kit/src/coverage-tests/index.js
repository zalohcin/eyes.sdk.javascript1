const defaultExecutionModes = [
  {isVisualGrid: true},
  {isCssStitching: true},
  {isScrollStitching: true},
]

const executionModes = {
  checkRegionClassic: defaultExecutionModes,
  checkRegionFluent: defaultExecutionModes,
  checkWindowClassic: defaultExecutionModes,
  checkWindowFluent: defaultExecutionModes,
}

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

  return {
    checkRegionClassic: async () => {
      await visit(url)
      await open({appName, testName: 'checkRegionClassic', viewportSize})
      await check({
        isClassicApi: true,
        locator: '#overflowing-div',
      })
      await close(throwException)
    },
    checkRegionFluent: async () => {
      await visit(url)
      await open({appName, testName: 'checkRegionFluent', viewportSize})
      await check({
        locator: '#overflowing-div',
      })
      close(throwException)
    },
    checkWindowClassic: async () => {
      await visit(url)
      await open({appName, testName: 'checkWindowClassic', viewportSize})
      await check({
        isClassicApi: true,
      })
      await close(throwException)
    },
    checkWindowFluent: async () => {
      await visit(url)
      await open({appName, testName: 'checkWindowFluent', viewportSize})
      await check()
      await close(throwException)
    },
  }
}

async function runCoverageTests(sdkName, makeRun, supportedTests) {
  // init
  console.log(`Coverage Tests are running for ${sdkName}...`)
  const p = []
  const e = {}

  // execution loop
  supportedTests.forEach(supportedTest => {
    executionModes[supportedTest].forEach(executionMode => {
      p.push(async () => {
        const test = makeCoverageTests(await makeRun(executionMode))[supportedTest]
        await test().catch(error => {
          const testName = `${test.name} with ${Object.keys(executionMode)[0]}`
          if (!e[testName]) {
            e[testName] = []
          }
          e[testName].push(error)
        })
      })
    })
  })
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
