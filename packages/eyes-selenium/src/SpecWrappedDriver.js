/**
 * @typedef {import('./selenium3/SpecWrappedDriver').Driver|import('./selenium4/SpecWrappedDriver').Driver} Driver
 */

/** @type {import('./selenium3/SpecWrappedDriver')|import('./selenium4/SpecWrappedDriver')} */
module.exports =
  process.env.APPLITOOLS_SELENIUM_MAJOR_VERSION === '3'
    ? require('./selenium3/SpecWrappedDriver')
    : require('./selenium4/SpecWrappedDriver')
