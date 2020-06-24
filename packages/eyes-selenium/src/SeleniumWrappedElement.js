const {EyesWrappedElement} = require('@applitools/eyes-sdk-core')
const SpecWrappedElement = require('./SpecWrappedElement')

/**
 * @typedef {import('./selenium3/SpecWrappedDriver').Driver} Selenium3Driver
 * @typedef {import('./selenium4/SpecWrappedDriver').Driver} Selenium4Driver
 * @typedef {import('./selenium3/SpecWrappedElement').Element} Selenium3Element
 * @typedef {import('./selenium4/SpecWrappedElement').Element} Selenium4Element
 * @typedef {import('./selenium3/SpecWrappedElement').Selector} Selenium3Selector
 * @typedef {import('./selenium4/SpecWrappedElement').Selector} Selenium4Selector
 */

/** @type {EyesWrappedElement<SeleniumDriver, SeleniumElement, SeleniumSelector>} */
const SeleniumWrappedElement = EyesWrappedElement.specialize(SpecWrappedElement)

module.exports = SeleniumWrappedElement
