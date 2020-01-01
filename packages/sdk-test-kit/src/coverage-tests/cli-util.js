const {findDifferencesBetweenCollections} = require('./common-util')
const {makeCoverageTests} = require('./index')
const {supportedCommands} = require('./tests')

function findUnsupportedTests(sdkImplementation) {
  const allTests = makeCoverageTests()
  const sdkSupportedTests = sdkImplementation.supportedTests.map(test => test.name)
  return findDifferencesBetweenCollections(allTests, sdkSupportedTests)
}

function findUnimplementedCommands(sdkImplementation) {
  const allCommands = supportedCommands
  const sdkImplementedCommands = sdkImplementation.initialize()
  return findDifferencesBetweenCollections(allCommands, sdkImplementedCommands)
}

module.exports = {
  findUnsupportedTests,
  findUnimplementedCommands,
}
