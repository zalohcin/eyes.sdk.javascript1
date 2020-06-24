const {EyesFactory, EyesClassic, EyesVisualGrid} = require('@applitools/eyes-sdk-core')
const VisualGridClient = require('@applitools/visual-grid-client')
const WrappedDriver = require('./SeleniumWrappedDriver')
const WrappedElement = require('./SeleniumWrappedElement')
const CheckSettings = require('./SeleniumCheckSettings')

const {version} = require('../package.json')

/**
 * @typedef {import('./selenium3/SpecWrappedDriver').Driver} Selenium3Driver
 * @typedef {import('./selenium3/SpecWrappedElement').Element} Selenium3Element
 * @typedef {import('./selenium3/SpecWrappedElement').Selector} Selenium3Selector
 * @typedef {EyesClassic<Selenium3Driver, Selenium3Element, Selenium3Selector>} Selenium3EyesClassic
 * @typedef {EyesVisualGrid<Selenium3Driver, Selenium3Element, Selenium3Selector>} Selenium3EyesVisualGrid
 * @typedef {EyesFactory<Selenium3Driver, Selenium3Element, Selenium3Selector>} Selenium3EyesFactory
 *
 * @typedef {import('./selenium4/SpecWrappedDriver').Driver} Selenium4Driver
 * @typedef {import('./selenium4/SpecWrappedElement').Element} Selenium4Element
 * @typedef {import('./selenium4/SpecWrappedElement').Selector} Selenium4Selector
 * @typedef {EyesClassic<Selenium4Driver, Selenium4Element, Selenium4Selector>} Selenium4EyesClassic
 * @typedef {EyesVisualGrid<Selenium4Driver, Selenium4Element, Selenium4Selector>} Selenium4EyesVisualGrid
 * @typedef {EyesFactory<Selenium4Driver, Selenium4Element, Selenium4Selector>} Selenium4EyesFactory
 */

/** @type {Selenium3EyesClassic|Selenium4EyesClassic} */
const SeleniumEyesClassic = EyesClassic.specialize({
  agentId: `eyes.selenium.javascript/${version}--${process.env.APPLITOOLS_SELENIUM_MAJOR_VERSION}`,
  WrappedDriver,
  WrappedElement,
  CheckSettings,
})

/** @type {Selenium3EyesVisualGrid|Selenium4EyesVisualGrid} */
const SeleniumEyesVisualGrid = EyesVisualGrid.specialize({
  agentId: `eyes.selenium.visualgrid.javascript/${version}--${process.env.APPLITOOLS_SELENIUM_MAJOR_VERSION}`,
  WrappedDriver,
  WrappedElement,
  CheckSettings,
  VisualGridClient,
})

/** @type {Selenium3EyesFactory|Selenium4EyesFactory} */
const SeleniumEyesFactory = EyesFactory.specialize({
  EyesClassic: SeleniumEyesClassic,
  EyesVisualGrid: SeleniumEyesVisualGrid,
})

module.exports = {
  SeleniumEyesClassic,
  SeleniumEyesVisualGrid,
  SeleniumEyesFactory,
}
