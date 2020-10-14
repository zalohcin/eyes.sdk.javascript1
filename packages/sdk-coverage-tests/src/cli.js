#!/usr/bin/env node

const yargs = require('yargs')
const {generate, report} = require('./cli/commands')

const cliName = 'SAT - SDK Agnostic Test-framework'

const cli = yargs
  .usage(cliName)
  .command({
    command: 'generate [config-path]',
    description: 'create test files for a given SDK configuration',
    builder: yargs =>
      yargs.options({
        configPath: {
          description: 'path to the sdk configuration .js file',
          type: 'string',
          default: './test/coverage/index.js',
        },
        tests: {
          alias: 't',
          description: 'path to the tests file (local or remote)',
          type: 'string',
        },
      }),
    handler: generate,
  })
  .command({
    command: 'report [config-path]',
    description: 'send a report to QA dashboard',
    builder: yargs =>
      yargs.options({
        configPath: {
          description: 'path to the sdk configuration .js file',
          type: 'string',
          default: './test/coverage/index.js',
        },
        metaPath: {
          description: 'path to the json metadata file generated with tests',
          type: 'string',
          default: './test/coverage/index.js',
        },
        resultsPath: {
          description: 'path to the junit xml file',
          type: 'string',
          default: './test/coverage/index.js',
        },
        reportId: {
          alias: 'id',
          describe: 'Id of the report which will be displayed at the dashboard',
        },
      }),
    handler: report,
  })
  .option('verbose', {
    alias: 'v',
    describe: 'log debug output',
  })
  .demandCommand(1, 'You need to specify a command before moving on')

cli.argv
