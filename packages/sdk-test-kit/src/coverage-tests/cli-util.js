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

function filterTestsByName(filter, tests) {
  if (!filter) return tests
  return tests.filter(test => {
    return test.name.includes(filter)
  })
}

function filterTestsByMode(filter, tests) {
  if (!filter) return tests
  return tests.filter(test => {
    return test.executionMode.hasOwnProperty(filter)
  })
}

function sortErrorsByType(errors) {
  return errors.sort((a, b) => {
    const nameA = a.name.toLowerCase()
    const nameB = b.name.toLowerCase()
    if (nameA < nameB) return -1
    else if (nameA > nameB) return 1
    else return 0
  })
}

module.exports = {
  findUnsupportedTests,
  findUnimplementedCommands,
  filterTestsByName,
  filterTestsByMode,
  sortErrorsByType,
}
