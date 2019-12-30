const throat = require('throat')

function makeCoverageTests({
  abort,
  checkFrame,
  checkRegion,
  checkWindow,
  close,
  open,
  scrollDown,
  switchToFrame,
  type,
  visit,
}) {
  const url = 'https://applitools.github.io/demo/TestPages/FramesTestPage/'
  const viewportSize = '700x460'
  const throwException = true

  async function sleep(timeout) {
    return new Promise(resolve => setTimeout(resolve, timeout))
  }

  return {
    'Test Abort': async () => {
      await visit('data:text/html,<p>Test</p>')
      await checkWindow()
      await sleep(15000)
      await abort()
    },
    TestAcmeLogin: async () => {
      await visit('https://afternoon-savannah-68940.herokuapp.com/#')
      await open({appName: 'Eyes Selenium SDK - ACME', viewportSize: '1024x768'})
      await type('#username', 'adamC')
      await type('#password', 'MySecret123?')
      await checkRegion(['#username', '#password'])
    },
    TestCheckElementFully_Fluent: async () => {
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      await checkRegion('iframe[name="frame1"]', {isFully: true})
      await close(throwException)
    },
    TestCheckElementWithIgnoreRegionByElementOutsideTheViewport_Fluent: async () => {
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      await checkRegion('#overflowing-div-image', {ignoreRegion: '#overflowing-div'})
      await close(throwException)
    },
    TestCheckElementWithIgnoreRegionBySameElement_Fluent: async () => {
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      await checkRegion('#overflowing-div-image', {ignoreRegion: '#overflowing-div-image'})
      await close(throwException)
    },
    TestCheckFrame: async () => {
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Classic API', viewportSize})
      await checkFrame('[name="frame1"]', {isClassicApi: true})
      await close(throwException)
    },
    TestCheckFrame_Fluent: async () => {
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      await checkFrame('[name="frame1"]')
      await close(throwException)
    },
    TestCheckFrameFully_Fluent: async () => {
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      await checkFrame('[name="frame1"]', {isFully: true})
      await close(throwException)
    },
    TestCheckFrameInFrame_Fully_Fluent: async () => {
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      await checkFrame(['[name="frame1"]', '[name="frame1-1"]'], {isFully: true})
      await close(throwException)
    },
    TestCheckFrameInFrame_Fully_Fluent2: async () => {
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      await checkWindow({isFully: true})
      await checkFrame(['[name="frame1"]', '[name="frame1-1"]'], {isFully: true})
      await close(throwException)
    },
    TestCheckFullWindowWithMultipleIgnoreRegionsBySelector_Fluent: async () => {
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      await checkWindow({isFully: true, ignoreRegion: '.ignore'})
      await close(throwException)
    },
    TestCheckOverflowingRegionByCoordinates_Fluent: async () => {
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      await checkRegion({left: 50, top: 110, width: 90, height: 550})
      await close(throwException)
    },
    TestCheckPageWithHeader_Window: async () => {
      await visit('https://applitools.github.io/demo/TestPages/PageWithHeader/index.html')
      await open({appName: 'Eyes Selenium SDK - Page With Header', viewportSize})
      await checkWindow({isClassicApi: false, isFully: false})
      await close(throwException)
    },
    TestCheckPageWithHeaderFully_Window: async () => {
      await visit('https://applitools.github.io/demo/TestPages/PageWithHeader/index.html')
      await open({appName: 'Eyes Selenium SDK - Page With Header', viewportSize})
      await checkWindow({isClassicApi: false, isFully: true})
      await close(throwException)
    },
    TestCheckPageWithHeader_Region: async () => {
      await visit('https://applitools.github.io/demo/TestPages/PageWithHeader/index.html')
      await open({appName: 'Eyes Selenium SDK - Page With Header', viewportSize})
      await checkRegion('div.page', {isClassicApi: false, isFully: false})
      await close(throwException)
    },
    TestCheckPageWithHeaderFully_Region: async () => {
      await visit('https://applitools.github.io/demo/TestPages/PageWithHeader/index.html')
      await open({appName: 'Eyes Selenium SDK - Page With Header', viewportSize})
      await checkRegion('div.page', {isClassicApi: false, isFully: true})
      await close(throwException)
    },
    TestCheckRegion: async () => {
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Classic API', viewportSize})
      await checkRegion('#overflowing-div', {isClassicApi: true, isFully: true})
      await close(throwException)
    },
    TestCheckRegion2: async () => {
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Classic API', viewportSize})
      await checkRegion('#overflowing-div-image', {isClassicApi: true, isFully: true})
      await close(throwException)
    },
    TestCheckRegionInAVeryBigFrame: async () => {
      await visit('https://applitools.github.io/demo/TestPages/WixLikeTestPage/index.html')
      await open({appName: 'Eyes Selenium SDK - Special Cases', viewportSize})
      await checkRegion('img', {inFrame: 'iframe[name="frame1"]'})
      await close(throwException)
    },
    TestCheckRegionInAVeryBigFrameAfterManualSwitchToFrame: async () => {
      await visit('https://applitools.github.io/demo/TestPages/WixLikeTestPage/index.html')
      await open({appName: 'Eyes Selenium SDK - Special Cases', viewportSize})
      await switchToFrame('[name="frame1"]')
      await checkRegion('img')
      await close(throwException)
    },
    TestCheckRegionByCoordinates_Fluent: async () => {
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      await checkRegion({left: 50, top: 50, width: 100, height: 100})
      await close(throwException)
    },
    TestCheckRegionByCoordinatesInFrame_Fluent: async () => {
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      await checkRegion({left: 30, top: 40, width: 400, height: 1200}, {inFrame: '[name="frame1"]'})
      await close(throwException)
    },
    TestCheckRegionByCoordinatesInFrameFully_Fluent: async () => {
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      await checkRegion(
        {left: 30, top: 40, width: 400, height: 1200},
        {inFrame: 'iframe[name="frame1"]', isFully: true},
      )
      await close(throwException)
    },
    TestCheckRegionBySelectorAfterManualScroll_Fluent: async () => {
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      await scrollDown(250)
      await checkRegion('#centered')
      await close(throwException)
    },
    TestCheckRegionInFrame: async () => {
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Classic API', viewportSize})
      await checkRegion('#inner-frame-div', {
        inFrame: 'iframe[name="frame1"]',
        isClassicApi: true,
        isFully: true,
      })
      await close(throwException)
    },
    TestCheckRegionInFrame_Fluent: async () => {
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      await checkRegion('#inner-frame-div', {
        inFrame: 'iframe[name="frame1"]',
        isFully: true,
      })
      await close(throwException)
    },
    TestCheckRegionInFrame3_Fluent: async () => {
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      await checkRegion('#inner-frame-div', {
        inFrame: 'iframe[name="frame1"]',
        isFully: true,
        isLayout: true,
        floatingRegion: {
          target: 25,
          maxUp: 200,
          maxDown: 200,
          maxLeft: 150,
          maxRight: 150,
        },
      })
      await close(throwException)
    },
    TestCheckRegionWithIgnoreRegion_Fluent: async () => {
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      await checkRegion('#overflowing-div', {
        ignoreRegion: {left: 50, top: 50, width: 100, height: 100},
      })
      await close(throwException)
    },
    TestCheckScrollableModal: async () => {
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      await checkRegion('#modal-content', {scrollRootElement: '#modal1', isFully: true})
      await close(throwException)
    },
    TestCheckWindow: async () => {
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Classic API', viewportSize})
      await checkWindow({isClassicApi: true})
      await close(throwException)
    },
    TestCheckWindow_Body: async () => {
      await visit('https://applitools.github.io/demo/TestPages/SimpleTestPage/scrollablebody.html')
      await open({appName: 'Eyes Selenium SDK - Scroll Root Element', viewportSize})
      await checkWindow({scrollRootElement: 'body', isFully: true})
      await close(throwException)
    },
    TestCheckWindow_Fluent: async () => {
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      await checkWindow()
      await close(throwException)
    },
    TestCheckWindow_Html: async () => {
      await visit('https://applitools.github.io/demo/TestPages/SimpleTestPage/scrollablebody.html')
      await open({appName: 'Eyes Selenium SDK - Scroll Root Element', viewportSize})
      await checkWindow({scrollRootElement: 'html', isFully: true})
      await close(throwException)
    },
    TestCheckWindow_Simple_Html: async () => {
      await visit('https://applitools.github.io/demo/TestPages/SimpleTestPage/index.html')
      await open({appName: 'Eyes Selenium SDK - Scroll Root Element', viewportSize})
      await checkWindow({scrollRootElement: 'html', isFully: true})
      await close(throwException)
    },
    TestCheckWindowAfterScroll: async () => {
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Classic API', viewportSize})
      await scrollDown(250)
      await checkWindow({isClassicApi: true})
      await close(throwException)
    },
    TestCheckWindowFully: async () => {
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Classic API', viewportSize})
      await checkWindow({isClassicApi: true, isFully: true})
      await close(throwException)
    },
    TestCheckWindowViewport: async () => {
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Classic API', viewportSize})
      await checkWindow({isClassicApi: true, isFully: false})
      await close(throwException)
    },
    TestCheckWindowWithFloatingByRegion_Fluent: async () => {
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      await checkWindow({
        floatingRegion: {
          target: {left: 10, top: 10, width: 20, height: 10},
          maxUp: 3,
          maxDown: 3,
          maxLeft: 20,
          maxRight: 30,
        },
      })
      await close(throwException)
    },
    TestCheckWindowWithFloatingBySelector_Fluent: async () => {
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      await checkWindow({
        floatingRegion: {
          target: '#overflowing-div',
          maxUp: 3,
          maxDown: 3,
          maxLeft: 20,
          maxRight: 30,
        },
      })
      await close(throwException)
    },
    TestCheckWindowWithIgnoreBySelector_Fluent: async () => {
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      await checkWindow({ignoreRegion: '#overflowing-div'})
      await close(throwException)
    },
    TestCheckWindowWithIgnoreBySelector_Centered_Fluent: async () => {
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      await checkWindow({ignoreRegion: '#centered'})
      await close(throwException)
    },
    TestCheckWindowWithIgnoreBySelector_Stretched_Fluent: async () => {
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      await checkWindow({ignoreRegion: '#stretched'})
      await close(throwException)
    },
    TestCheckWindowWithIgnoreRegion_Fluent: async () => {
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      await type('input', 'My Input')
      await checkWindow({isFully: true, ignoreRegion: {left: 50, top: 50, width: 100, height: 100}})
      await close(throwException)
    },
    TestDoubleCheckWindow: async () => {
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Classic API', viewportSize})
      await checkWindow({isClassicApi: true, tag: 'first'})
      await checkWindow({isClassicApi: true, tag: 'second'})
      await close(throwException)
    },
    TestSimpleRegion: async () => {
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      await checkRegion({left: 50, top: 50, width: 100, height: 100})
    },
    TestScrollbarsHiddenAndReturned_Fluent: async () => {
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      await checkWindow({isFully: true})
      await checkRegion('#inner-frame-div', {isFully: true})
      await checkWindow({isFully: true})
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
          process.stdout.write('.')
        } catch (error) {
          process.stdout.write('F')
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

// TODO: move util functions into respective places -- e.g., send-report-util
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
    toSendReportSchema: makeSendReport.bind(undefined, {sdkName, testsRan, e}),
  }
  // TODO: expose data and render output elsewhere -- e.g., cli-util
  report.summary.push(`Ran ${p.length} tests in ${end - start}ms`)
  if (hasErrors) {
    report.summary.push(`Encountered n errors in ${Object.keys(e).length} tests`)
  }
  return {report}
}

function makeSendReport({sdkName, testsRan, e}) {
  return {
    sdk: convertSdkNameToReportName(sdkName),
    group: 'selenium', // TODO: make dynamic
    sandbox: true, // TODO: make dynamic
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
