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

    if (tests.length <= 0) {
      const message = `No test will be emitted. Please check "testPath", "emitSkipped", "emitOnly" config parameters`
      console.log(chalk.yellow(message), '\n')
      return
    }

    const {emittedTests, errors} = emitTests(tests, {
      makeSdk: config.initializeSdk,
      fileTemplate: config.testFrameworkTemplate,
    })

    if (errors.length > 0) {
      if (config.strict) {
        const [{test, error}] = errors
        console.log(chalk.red(`Error during emitting test "${test.name}":`))
        throw error
      }
      errors.forEach(({test, error}) => {
        console.log(chalk.red(`Error during emitting test "${test.name}":`))
        console.log(chalk.grey(error.stack))
      })
    }

    await createTestFiles(emittedTests, config)
    await createTestMetaData(emittedTests, config)

    const skippedTestsCount = emittedTests.reduce((count, t) => count + (t.skip ? 1 : 0), 0)

    console.log(chalk.green(`${chalk.bold(`${emittedTests.length}`.padEnd(3))} test(s) generated`))
    console.log(chalk.cyan(`${chalk.bold(`${skippedTestsCount}`.padEnd(3))} test(s) skipped`))
    console.log(chalk.red(`${chalk.bold(`${errors.length}`.padEnd(3))} error(s) occurred`))
  } catch (err) {
    console.log(chalk.red(err.stack))
    process.exit(1)
  }
}

module.exports = generate
