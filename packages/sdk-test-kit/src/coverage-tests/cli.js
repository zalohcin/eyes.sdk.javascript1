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
  .usage('a.k.a. Da Schwartz Lang - except no substitutes')
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
    exec(`ps ax | grep Chrome | grep headless | awk '{print $1}' | xargs kill -9`)
    console.log('KABOOM!')
  } else if (args.path) {
    const sdkImplementation = require(path.join(path.resolve('.'), args.path))

    console.log(`Running coverage tests for ${sdkImplementation.name}...\n`)

    const report = await doRunTests(args, sdkImplementation)
    await doSendReport(args, report)
    await doDisplayResults(report)
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

async function doRunTests(args, sdkImplementation) {
  if (needsChromeDriver(args, sdkImplementation))
    await startChromeDriver(sdkImplementation.options.chromeDriverOptions)

  const {report} = await makeRunTests(
    sdkImplementation.name,
    sdkImplementation.initialize,
  ).runTests(sdkImplementation.supportedTests, {
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
    if (result.isSuccessful) console.log('Report sent!')
    else console.log(`Report not sent because of: ${result.message}`)
  }
}

function doDisplayResults(report) {
  if (Object.keys(report.errors).length) {
    console.log(`-------------------- ERRORS --------------------`)
    console.log(report.errors)
  }
  console.log(`-------------------- SUMMARY --------------------`)
  report.summary.forEach(entry => console.log(entry))
}

async function startChromeDriver(options = ['--port=4444', '--url-base=wd/hub', '--silent']) {
  const returnPromise = true
  return await chromedriver.start(options, returnPromise).catch(console.error)
}

async function stopChromeDriver() {
  chromedriver.stop()
}
