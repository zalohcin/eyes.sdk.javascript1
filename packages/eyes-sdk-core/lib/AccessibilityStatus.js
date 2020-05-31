'use strict'
const Enum = require('./utils/Enum')

/**
 * @readonly
 * @enum {string}
 */
const AccessibilityStatus = Enum('AccessibilityStatus', {
  Passed: 'Passed',
  Failed: 'Failed',
})

exports.AccessibilityStatus = AccessibilityStatus
