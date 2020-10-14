const path = require('path')
const chalk = require('chalk')
const {prepareTests, makeTests, createTestFiles, createTestMetaData} = require('../../generate')

const DEFAULT_CONFIG = {
  tests: 'https://raw.githubusercontent.com/applitools/sdk.coverage.tests/master/tests.js',
}

async function generate({configPath, ...options}) {
  try {
    const config = {
      ...DEFAULT_CONFIG,
      ...require(path.join(path.resolve('.'), configPath)),
      ...options,
    }
    console.log(`Creating coverage tests for ${config.name}...`)

    const suite = await prepareTests(config.tests)

    const emittedTests = makeTests(suite, config.initialize)
    await createTestFiles(emittedTests, config)
    await createTestMetaData(emittedTests, config)
    // console.log(
    //   `\nCreated ${supportedTests.length} (${numberOfTestVariations({
    //     tests: supportedTests,
    //     args,
    //   })} enabled) test files for ${numberOfUniqueTests({
    //     tests: supportedTests,
    //     args,
    //   })} unique tests.`,
    // )
  } catch (err) {
    console.log(chalk.red(err.stack))
    process.exit(1)
  }
}

module.exports = generate
