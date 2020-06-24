const path = require('path')
const {filterTests, numberOfTestVariations, numberOfUniqueTests} = require('../cli-util')
const {makeEmitTests, createTestFiles} = require('../../code-export')

const defaultSdkImplementation = {
  out: './test/coverage/generic',
  ext: '.spec.js',
}

async function createTests(args) {
  const sdkImplementation = Object.assign(
    defaultSdkImplementation,
    require(path.join(path.resolve('.'), args.path)),
  )
  console.log(`Creating coverage tests for ${sdkImplementation.name}...`)

  const supportedTests = filterTests({tests: sdkImplementation.supportedTests, args})
  const emittedTests = makeEmitTests(sdkImplementation.initialize).emitTests(supportedTests, {
    host: args.remote,
    all: args.all,
  })
  await createTestFiles(emittedTests, sdkImplementation)
  console.log(
    `\nCreated ${supportedTests.length} (${numberOfTestVariations({
      tests: supportedTests,
      args,
    })} enabled) test files for ${numberOfUniqueTests({
      tests: supportedTests,
      args,
    })} unique tests.`,
  )
}

module.exports = {createTests}
