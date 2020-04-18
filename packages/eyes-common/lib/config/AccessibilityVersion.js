'use strict'

const {Enum} = require('../utils/Enum')

/**
 * The spec version for which to check the image visual accessibility level.
 *
 * @readonly
 * @enum {string}
 */
const AccessibilityVersion = Enum('AccessibilityVersion', {
  WCAG_2_0: 'WCAG_2_0',
  WCAG_2_1: 'WCAG_2_1',
})

exports.AccessibilityVersion = AccessibilityVersion
