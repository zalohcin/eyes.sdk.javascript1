const Enum = require('./utils/Enum')

/**
 * @enum
 * @typedef {string} TestResultsStatus
 */

const TestResultsStatuses = Enum('TestResultsStatus', {
  Passed: 'Passed',
  Unresolved: 'Unresolved',
  Failed: 'Failed',
  Empty: 'Empty'
})

module.exports = TestResultsStatuses
