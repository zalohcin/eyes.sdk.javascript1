/**
 * @typedef {import('./selenium3/SpecWrappedElement').Element|import('./selenium4/SpecWrappedElement').Element} Element
 * @typedef {import('./selenium3/SpecWrappedElement').Selector|import('./selenium4/SpecWrappedElement').Selector} Selector
 */

/** @type {import('./selenium3/SpecWrappedElement')|import('./selenium4/SpecWrappedElement')} */
module.exports =
  process.env.APPLITOOLS_SELENIUM_MAJOR_VERSION === '3'
    ? require('./selenium3/SpecWrappedElement')
    : require('./selenium4/SpecWrappedElement')
