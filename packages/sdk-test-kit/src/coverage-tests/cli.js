#!/usr/bin/env node
const yargs = require('yargs')
const path = require('path')
const {makeRunTests} = require('./index')
const {exec} = require('child_process')
const {version} = require('../../package.json')

yargs
  .option('run', {
    alias: 'r',
    describe: 'run coverage tests for a given SDK',
  })
  .option('remote', {
    alias: 'r',
    describe: 'url of where to run the tests',
  })
  .option('path', {
    alias: 'p',
    describe: 'path to implementation file',
  })
  .option('concurrency', {
    alias: 'c',
    describe: 'number of parallel sessions to run at one time',
  })
  .option('nuke', {
    alias: 'n',
    describe: 'kill all ghost browser processes (POSIX only)',
  })
  .help().argv

if (yargs.argv.run && yargs.argv.path) {
  const sdkImplementation = require(path.join(path.resolve('.'), yargs.argv.path))
  console.log(`Coverage Tests DSL (v${version})`)
  console.log('a.k.a. Da Schwartz Lang - except no substitutes\n')
  console.log(`Running coverage tests for ${sdkImplementation.name}...\n`)
  makeRunTests(sdkImplementation.initialize)
    .runTests(sdkImplementation.supportedTests, {
      host: yargs.argv.remote,
      concurrency: yargs.argv.concurrency,
    })
    .then(({report}) => {
      console.log(`-------------------- SUMMARY --------------------`)
      report.summary.forEach(entry => console.log(entry))
      const exitCode = Object.keys(report.errors).length ? 1 : 0
      console.log(`Exiting with code ${exitCode}`)
      if (Object.keys(report.errors).length) {
        console.log(`-------------------- ERRORS --------------------`)
        console.log(report.errors)
      }
      process.exit(exitCode)
    })
} else if (yargs.argv.nuke) {
  exec(`ps ax | grep Chrome | grep headless | awk '{print $1}' | xargs kill -9`)
}
