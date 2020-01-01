#!/usr/bin/env node
const yargs = require('yargs')
const path = require('path')
const {makeRunTests, makeCoverageTests} = require('./index')
const {supportedCommands} = require('./tests')
const {sendReport} = require('./send-report')
const {exec} = require('child_process')
const {version} = require('../../package.json')
const chromedriver = require('chromedriver')
const {filter, unique, findDifferencesBetween} = require('./cli-util')

yargs
  .usage(`Coverage Tests DSL (v${version})`)
  .usage('a.k.a. Da Schwartz Lang - accept no substitutes')
  .usage('\nUsage: coverage-tests run <options>')
  .command('run', 'run coverage tests for a given SDK')
  .command('doctor', 'health check an implementation')
  .command('nuke', 'kill all ghost browser processes (POSIX only)')
  .option('path', {
    alias: 'p',
    describe: 'path to implementation file',
    default: 'test/coverage/index.js',
  })
  .option('filterName', {
    alias: 'fn',
    describe: 'filter which tests are run by name',
  })
  .option('filterMode', {
    alias: 'fm',
    describe: 'filter which tests are run by execution mode',
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
  .demandCommand(1, 'You need to specify a command before moving on')

async function run(args) {
  console.log(`Coverage Tests DSL (v${version})`)
  console.log('a.k.a. Da Schwartz Lang - accept no substitutes\n')
  const command = args._[0]
  if (command === 'nuke') {
    doKaboom()
    doExitCode(0)
  } else if (command === 'doctor' && args.path) {
    doHealthCheck(args)
  } else if (command === 'run' && args.path) {
    const report = await doRunTests(args)
    const sendReportResponse = await doSendReport(args, report)
    doDisplayResults(report, sendReportResponse)
    doExitCode(report.errors)
  } else {
    console.log('Nothing to run.')
    doExitCode(1)
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

function doHealthCheck(args) {
  console.log('Performing health check...\n')
  const sdkImplementation = require(path.join(path.resolve('.'), args.path))
  const coverageTests = Object.keys(makeCoverageTests())

  const supportedTests = unique(sdkImplementation.supportedTests.map(test => test.name))
  const unsupportedTests = findDifferencesBetween(coverageTests, supportedTests)

  const implementedCommands = sdkImplementation.initialize()
  const unimplementedCommands = findDifferencesBetween(supportedCommands, Object.keys(implementedCommands))

  if (unsupportedTests.length) {
    console.log('Unsupported tests found:')
    unsupportedTests.forEach(test => console.log(`- ${test}`))
    console.log('')
  }
  
  if (unimplementedCommands.length) {
    console.log('Unimplemented commands found:')
    unimplementedCommands.forEach(command => console.log(`- ${command}`))
    console.log('')
  }
  
  if (!unsupportedTests.length && !unimplementedCommands.length)
    console.log('Looks good to me.')
}

function doKaboom() {
  console.log('Cleaning up rogue processes...')
  exec(`ps ax | grep Chrome | grep headless | awk '{print $1}' | xargs kill -9`)
  console.log('KABOOM!')
}

async function doRunTests(args) {
  const sdkImplementation = require(path.join(path.resolve('.'), args.path))
  console.log(`Running coverage tests for ${sdkImplementation.name}...\n`)

  if (needsChromeDriver(args, sdkImplementation))
    await startChromeDriver(sdkImplementation.options.chromeDriverOptions)

  let supportedTests = [...sdkImplementation.supportedTests]
  if (args.filterName)
    supportedTests = filter(args.filterName, {from: 'name', inside: supportedTests})
  if (args.filterMode)
    supportedTests = filter(args.filterMode, {from: 'executionMode', inside: supportedTests})

  console.log(
    `Running ${supportedTests.length} executions for ${
      [...new Set(supportedTests.map(t => t.name))].length
    } tests.`,
  )
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
    console.log(`\n-------------------- ERRORS --------------------`)
    console.log(report.errors)
  }
  console.log(`\n-------------------- SUMMARY --------------------`)
  console.log(`Ran ${report.stats.numberOfTests} tests across ${report.stats.numberOfExecutions} executions in ${report.stats.duration}ms`)
  console.log(`\nStats:`)
  console.log(`- Passed (across all execution modes): ${report.stats.numberOfTestsPassed}`)
  console.log(`- Failed (in one or more execution modes): ${report.stats.numberOfTestsFailed}`)
  console.log(`- Total failures: ${report.stats.numberOfExecutionsFailed}\n`)
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
