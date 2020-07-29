const Enum = require('./utils/Enum')

/**
 * @typedef {string} TestResultsStatus
 */

const TestResultsStatuses = Enum('TestResultsStatus', {
  Passed: 'Passed',
  Unresolved: 'Unresolved',
  Failed: 'Failed',
})

module.exports = TestResultsStatuses
