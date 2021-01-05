#!/usr/bin/env node

const yargs = require('yargs')
const generate = require('./generate/command')
const report = require('./report')

const cliName = 'SAT - SDK Agnostic Test-framework'

const cli = yargs
  .usage(cliName)
  .command({
    command: 'generate [config-path]',
    description: 'create test files for a given SDK configuration',
    builder: yargs =>
      yargs.options({
        config: {
          aliases: ['configPath', 'c'],
          description: 'path to the sdk configuration .js file',
          type: 'string',
          default: './test/coverage/index.js',
        },
        testsPath: {
          aliases: ['tests', 't'],
          description: 'path to the tests file (local or remote)',
          type: 'string',
        },
        templatePath: {
          aliases: ['template'],
          description: 'path to the template .hbs file (local or remote)',
          type: 'string',
        },
        specPath: {
          aliases: ['spec', 's'],
          description: 'path to the spec emitter definition file (local or remote)',
          type: 'string',
        },
        overridesPath: {
          aliases: ['overrides'],
          description: 'path to the tests overrides file (local or remote)',
          type: 'string',
        },
        outPath: {
          aliases: ['output', 'o'],
          description: 'path to save generated files',
          type: 'string',
        },
        metaPath: {
          description: 'path to save metadata file',
          type: 'string',
        },
        emitSkipped: {
          description: 'whether to create tests that are marked as skipped',
          type: 'boolean',
          default: true,
        },
        emitOnly: {
          description: 'name of the test to emit',
          type: 'array',
        },
        ignoreSkip: {
          description: 'ignore skip flag',
          type: 'boolean',
        },
        ignoreSkipEmit: {
          description: 'ignore skip emit flag',
          type: 'boolean',
        },
        pascalizeTests: {
          description: 'save tests metadata with pascalized keys',
          type: 'boolean',
          default: false,
        },
        strict: {
          description: 'whether to throw an error if test emitting is failed',
          type: 'boolean',
          default: false,
        },
        name: {
          alias: 'n',
          description: 'the sdk name',
          type: 'string',
        },
        ext: {
          alias: 'e',
          description: 'extension for generated files (e.g. ".spec.js")',
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
        name: {
          alias: 'n',
          description: 'the sdk name',
          type: 'string',
        },
        metaPath: {
          description: 'path to the json metadata file generated with tests',
          type: 'string',
        },
        resultsPath: {
          description: 'path to the junit xml file',
          type: 'string',
        },
        reportId: {
          alias: 'id',
          describe: 'id of the report which will be displayed at the dashboard',
        },
        sandbox: {
          description: `send a result report to the sandbox QA dashboard instead of prod`,
        },
      }),
    handler: report,
  })
  .demandCommand(1, 'You need to specify a command before moving on')

cli.argv
