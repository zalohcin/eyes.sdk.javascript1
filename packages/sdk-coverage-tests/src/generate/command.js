const path = require('path')
const chalk = require('chalk')
const {prepareTests} = require('./prepare')
const {emitTests} = require('./emit')
const {createTestFiles, createTestMetaData} = require('./save')

const DEFAULT_CONFIG = {
  testsPath:
    'https://raw.githubusercontent.com/applitools/sdk.coverage.tests/master/coverage-tests.js',
}

async function generate({configPath, ...options}) {
  try {
    const config = {
      ...DEFAULT_CONFIG,
      ...require(path.join(path.resolve('.'), configPath)),
      ...options,
    }
    console.log(`Creating coverage tests for ${config.name}...\n`)

    const tests = await prepareTests(config)

    const emittedTests = emitTests(tests, {
      makeSdk: config.initializeSdk,
      fileTemplate: config.testFrameworkTemplate,
    })
    await createTestFiles(emittedTests, config)
    await createTestMetaData(emittedTests, config)

    const skippedTestsCount = emittedTests.reduce((count, t) => count + (t.skip ? 1 : 0), 0)

    console.log(`Created ${emittedTests.length} (${skippedTestsCount} skipped) test files`)
  } catch (err) {
    console.log(chalk.red(err.stack))
    process.exit(1)
  }
}

module.exports = generate
