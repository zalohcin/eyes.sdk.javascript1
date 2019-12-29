#!/usr/bin/env node
const yargs = require('yargs')
const path = require('path')
const {makeRunTests} = require('./index')
const {sendReport} = require('./send-report')
const {exec} = require('child_process')
const {version} = require('../../package.json')
const chromedriver = require('chromedriver')

yargs
  .usage(`Coverage Tests DSL (v${version})`)
  .usage('a.k.a. Da Schwartz Lang - accept no substitutes')
  .usage('\nUsage: coverage-tests run <options>')
  .command('run', 'run coverage tests for a given SDK')
  .option('nuke', {
    alias: 'n',
    describe: 'kill all ghost browser processes (POSIX only)',
  })
  .option('path', {
    alias: 'p',
    describe: 'path to implementation file',
    default: 'test/coverage/index.js',
  })
  .option('filterName', {
    alias: 'f',
    describe: 'filter which tests are run by name',
  })
  .option('remote', {
    alias: 'r',
    describe: 'url of where to run the tests',
  })
  .option('concurrency', {
    alias: 'c',
    describe: 'number of parallel sessions to run at one time',
  })
  .option('sendReport', {
    alias: 's',
    describe: 'send a result report to the sandbox QA dashboard',
  })

async function run(args) {
  if (args.nuke) {
    doKaboom()
  } else if (args.path) {
    console.log(`Coverage Tests DSL (v${version})`)
    console.log('a.k.a. Da Schwartz Lang - accept no substitutes')
    const report = await doRunTests(args)
    const sendReportResponse = await doSendReport(args, report)
    doDisplayResults(report, sendReportResponse)
    doExitCode(report.errors)
  }
}

run(yargs.argv)

function needsChromeDriver(args, sdkImplementation) {
  return !args.remote && sdkImplementation.options && sdkImplementation.options.needsChromeDriver
}

function doExitCode(errors) {
  const exitCode = Object.keys(errors).length ? 1 : 0
  console.log(`Exited with code ${exitCode}`)
  process.exit(exitCode)
}

function doKaboom() {
  exec(`ps ax | grep Chrome | grep headless | awk '{print $1}' | xargs kill -9`)
  console.log('KABOOM!')
}

async function doRunTests(args) {
  const sdkImplementation = require(path.join(path.resolve('.'), args.path))
  console.log(`Running coverage tests for ${sdkImplementation.name}...\n`)

  if (needsChromeDriver(args, sdkImplementation))
    await startChromeDriver(sdkImplementation.options.chromeDriverOptions)

  const supportedTests = args.filterName
    ? sdkImplementation.supportedTests.filter(test => test.name.includes(args.filterName))
    : sdkImplementation.supportedTests
  const {report} = await makeRunTests(
    sdkImplementation.name,
    sdkImplementation.initialize,
  ).runTests(supportedTests, {
    host: args.remote,
    concurrency: args.concurrency,
  })

  if (needsChromeDriver(args, sdkImplementation)) stopChromeDriver()

  return report
}

async function doSendReport(args, report) {
  if (args.sendReport) {
    console.log('Sending report to QA dashboard...')
    const result = await sendReport(report.toSendReportSchema())
    return result
  }
}

function doDisplayResults(report, sendReportResponse) {
  if (Object.keys(report.errors).length) {
    console.log(`-------------------- ERRORS --------------------`)
    console.log(report.errors)
  }
  console.log(`-------------------- SUMMARY --------------------`)
  report.summary.forEach(entry => console.log(entry))
  if (sendReportResponse.isSuccessful) {
    console.log('Report successfully sent to the sandbox QA dashboard')
    console.log('See the results at http://bit.ly/sdk-test-results')
  } else
    console.log(`Report not sent to the QA dashboard because of: ${sendReportResponse.message}`)
}

async function startChromeDriver(options = []) {
  const returnPromise = true
  return await chromedriver.start(options, returnPromise).catch(console.error)
}

async function stopChromeDriver() {
  chromedriver.stop()
}
