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
  .option('path', {
    alias: 'p',
    describe: 'path to implementation file',
  })
  .option('nuke', {
    alias: 'n',
    describe: 'kill all ghost processes (overzealously)',
  })
  .help().argv

if (yargs.argv.run && yargs.argv.path) {
  const sdkImplementation = require(path.join(path.resolve('.'), yargs.argv.path))
  console.log(`Coverage Tests DSL (v${version})`)
  console.log('a.k.a. Da Schwartz Lang - except no substitutes\n')
  console.log(`Running coverage tests for ${sdkImplementation.name}...\n`)
  makeRunTests(sdkImplementation.initialize)
    .runTests(sdkImplementation.supportedTests)
    .then(({report}) => {
      if (Object.keys(report.errors).length) {
        console.log(report.errors)
      }
      report.summary.forEach(entry => console.log(entry))
      const exitCode = Object.keys(report.errors).length ? 1 : 0
      console.log(`Exiting with code ${exitCode}`)
      process.exit(exitCode)
    })
} else if (yargs.argv.nuke) {
  exec(`ps ax | grep Chrome | awk '{print $1}' | xargs kill -9`)
}
