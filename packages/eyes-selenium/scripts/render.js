'use strict'

const {URL} = require('url')
const {Builder} = require('selenium-webdriver')
const {
  Eyes,
  ClassicRunner,
  Target,
  FileLogHandler,
  Configuration,
  StitchMode,
  // BatchInfo,
  // FileDebugScreenshotsProvider,
} = require('../index')
const path = require('path')

const url = process.argv[2]
if (!url) {
  throw new Error('missing url argument!')
}

;(async function() {
  console.log('Running Selenium render for', url, '\n')
  const driver = await buildDriver({headless: true})

  const runner = new ClassicRunner()
  const eyes = new Eyes(runner)
  const configuration = new Configuration({
    viewportSize: {width: 1024, height: 768},
    stitchMode: StitchMode.CSS,
  })
  eyes.setConfiguration(configuration)
  const {logger, logFilePath} = initLog(eyes, new URL(url).hostname.replace(/\./g, '-'))
  logger.log('Running Selenium render for', url)
  console.log('log file at:', logFilePath)

  await driver.get(url)
  await eyes.open(driver, 'selenium render', url)
  await eyes.check('selenium render', Target.window().fully())
  await eyes.close(false)

  const testResultsSummary = await runner.getAllTestResults(false)
  const resultsStr = testResultsSummary
    .getAllResults()
    .map(testResultContainer => {
      const testResults = testResultContainer.getTestResults()
      return testResults ? formatResults(testResults) : testResultContainer.getException()
    })
    .join('\n')

  console.log('\nRender results\n\n', resultsStr)
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
