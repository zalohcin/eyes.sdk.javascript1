'use strict'

const {URL} = require('url')
const {Builder, By} = require('selenium-webdriver')
const {
  Eyes,
  ClassicRunner,
  VisualGridRunner,
  Target,
  FileLogHandler,
  Configuration,
  StitchMode,
  // BatchInfo,
  // FileDebugScreenshotsProvider,
} = require('../index')
const path = require('path')
const yargs = require('yargs')
const args = yargs
  .usage('yarn render <url> [options]')
  .option('vg', {
    type: 'boolean',
    describe: 'when specified, use visual grid instead of classic runner',
  })
  .option('css', {
    type: 'boolean',
    describe: 'when specified, use CSS stitch mode',
  })
  .option('headless', {
    default: true,
    type: 'boolean',
    describe: 'open browser in non-headless mode',
  })
  .option('fully', {
    type: 'boolean',
    describe: 'whether to check target fully',
  })
  .option('delay', {
    describe: 'delay in seconds before capturing page',
    type: 'number',
    default: 0,
  })
  .option('browser', {
    alias: 'b',
    describe: 'the browser to render to when in vg mode',
    type: 'string',
    coerce: parseBrowser,
  })
  .option('ignore-displacements', {
    describe: 'when specified, ignore displaced content',
    type: 'boolean',
  })
  .option('ignore-regions', {
    describe: 'comma-separated list of selectors to ignore',
    type: 'string',
  })
  .help().argv

const [url] = args._
if (!url) {
  throw new Error('missing url argument!')
}

;(async function() {
  console.log('Running Selenium render for', url)
  console.log(
    'Options: ',
    Object.keys(args)
      .map(key => (!['_', '$0'].includes(key) ? `* ${key}: ${args[key]}` : ''))
      .join('\n  '),
  )
  const driver = await buildDriver({headless: args.headless})

  const runner = args.vg ? new VisualGridRunner() : new ClassicRunner()
  const eyes = new Eyes(runner)
  const configuration = new Configuration({
    viewportSize: {width: 1024, height: 768},
    stitchMode: args.css ? StitchMode.CSS : StitchMode.SCROLL,
  })
  if (args.ignoreDisplacements) {
    configuration.setIgnoreDisplacements(true)
  }
  if (args.browser) {
    configuration.addBrowsers(args.browser)
  }
  eyes.setConfiguration(configuration)
  const {logger, logFilePath} = initLog(eyes, new URL(url).hostname.replace(/\./g, '-'))
  logger.log('[render script] Running Selenium render for', url)
  logger.log(`[render script] process versions: ${JSON.stringify(process.versions)}`)
  console.log('log file at:', logFilePath)

  await driver.get(url)

  try {
    await eyes.open(driver, 'selenium render', url)

    let target = Target.window()
    if (args.fully) {
      target = target.fully()
    }

    if (args.ignoreRegions) {
      target.ignoreRegions.apply(
        target,
        args.ignoreRegions.split(',').map(s => By.css(s.trim())),
      )
    }

    logger.log('[render script] awaiting delay...', args.delay * 1000)
    await new Promise(r => setTimeout(r, args.delay * 1000))
    logger.log('[render script] awaiting delay... DONE')

    // debugger

    await eyes.check('selenium render', target)
    await eyes.close(false)

    const testResultsSummary = await runner.getAllTestResults(false)
    const resultsStr = testResultsSummary
      .getAllResults()
      .map(testResultContainer => {
        const testResults = testResultContainer.getTestResults()
        return testResults ? formatResults(testResults) : testResultContainer.getException()
      })
      .join('\n')

    console.log('\nRender results:\n', resultsStr)
  } finally {
    await driver.quit()
  }
})()

function buildDriver({headless} = {}) {
  return (
    new Builder()
      .withCapabilities({
        browserName: 'chrome',
        'goog:chromeOptions': {
          args: headless ? ['--headless'] : [],
        },
      })
      // .usingServer('http://localhost.charlesproxy.com:9515')
      // .usingWebDriverProxy('http://localhost:8888')
      .build()
  )
}

function initLog(eyes, filename) {
  const logFilePath = path.resolve(__dirname, `../logs/${filename}-${formatDate(new Date())}.log`)
  const logHandler = new FileLogHandler(true, logFilePath)
  logHandler.open()
  eyes.setLogHandler(logHandler)
  return {logger: eyes.getLogger(), logFilePath}
}

function formatResults(testResults) {
  return `
Test name                 : ${testResults.getName()}
Test status               : ${testResults.getStatus()}
URL to results            : ${testResults.getUrl()}
Total number of steps     : ${testResults.getSteps()}
Number of matching steps  : ${testResults.getMatches()}
Number of visual diffs    : ${testResults.getMismatches()}
Number of missing steps   : ${testResults.getMissing()}
Display size              : ${testResults.getHostDisplaySize().toString()}
Steps                     :
${testResults
  .getStepsInfo()
  .map(step => {
    return `  ${step.getName()} - ${getStepStatus(step)}`
  })
  .join('\n')}`
}

function getStepStatus(step) {
  if (step.getIsDifferent()) {
    return 'Diff'
  } else if (!step.getHasBaselineImage()) {
    return 'New'
  } else if (!step.getHasCurrentImage()) {
    return 'Missing'
  } else {
    return 'Passed'
  }
}

function formatDate(d) {
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const date = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')
  return `${d.getFullYear()}-${month}-${date}-${hours}-${minutes}-${seconds}`
}

function parseBrowser(arg) {
  const match = /^(chrome|chrome-1|chrome-2|chrome-canary|firefox|firefox-1|firefox-2|ie11|ie10|edge|safari|safari-1|safari-2|ie-vmware|edge-chromium|edge-chromium-1|edge-chromium-2)(\( *(\d+) *(x|,) *(\d+) *\))?$/.exec(
    arg,
  )

  if (!match)
    throw new Error(
      'invalid syntax. Supports only chrome[-one-version-back/-two-versions-back], firefox[-one-version-back/-two-versions-back], ie11, ie10, edge, safari[-one-version-back/-two-versions-back] as browsers, and the syntax is browser(widthxheight)',
    )

  return {name: match[1], width: parseInt(match[3], 10), height: parseInt(match[5], 10)}
}
