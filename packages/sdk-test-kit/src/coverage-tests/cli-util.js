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

function filterTestsByIndexes(indexes, tests) {
  debugger
  if (!indexes) return tests
  const _indexes =
    typeof indexes === 'string' ? indexes.split(',').map(id => Math.floor(id)) : indexes
  let _tests = []
  _indexes.forEach(id => {
    _tests.push(tests[id])
  })
  return _tests
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

function getTestIndexesFromErrors(errors) {
  if (!errors) return undefined
  const indexes = errors
    .filter(error => error.hasOwnProperty('testIndex'))
    .map(entry => entry.testIndex)
  return indexes.length ? indexes : undefined
}

module.exports = {
  findUnsupportedTests,
  findUnimplementedCommands,
  filterTestsByName,
  filterTestsByMode,
  filterTestsByIndexes,
  getTestIndexesFromErrors,
  sortErrorsByType,
}
