const {EyesFactory, EyesClassic, EyesVisualGrid} = require('@applitools/eyes-sdk-core')
const VisualGridClient = require('@applitools/visual-grid-client')
const WrappedDriver = require('./SeleniumWrappedDriver')
const WrappedElement = require('./SeleniumWrappedElement')
const CheckSettings = require('./SeleniumCheckSettings')

const {version} = require('../package.json')

/**
 * @typedef {import('./selenium3/SpecWrappedDriver').Driver|import('./selenium4/SpecWrappedDriver').Driver} SeleniumDriver
 * @typedef {import('./selenium3/SpecWrappedElement').Element|import('./selenium4/SpecWrappedElement').Element} SeleniumElement
 * @typedef {import('./selenium3/SpecWrappedElement').Selector|import('./selenium4/SpecWrappedElement').Selector} SeleniumSelector
 */

/** @type {EyesClassic<SeleniumDriver, SeleniumElement, SeleniumSelector>} */
const SeleniumEyesClassic = EyesClassic.specialize({
  agentId: `eyes.selenium.javascript/${version}--${process.env.APPLITOOLS_SELENIUM_MAJOR_VERSION}`,
  WrappedDriver,
  WrappedElement,
  CheckSettings,
})

/** @type {EyesVisualGrid<SeleniumDriver, SeleniumElement, SeleniumSelector>} */
const SeleniumEyesVisualGrid = EyesVisualGrid.specialize({
  agentId: `eyes.selenium.visualgrid.javascript/${version}--${process.env.APPLITOOLS_SELENIUM_MAJOR_VERSION}`,
  WrappedDriver,
  WrappedElement,
  CheckSettings,
  VisualGridClient,
})

/** @type {EyesFactory<SeleniumDriver, SeleniumElement, SeleniumSelector>} */
const SeleniumEyesFactory = EyesFactory.specialize({
  EyesClassic: SeleniumEyesClassic,
  EyesVisualGrid: SeleniumEyesVisualGrid,
})

module.exports = {
  SeleniumEyesClassic,
  SeleniumEyesVisualGrid,
  SeleniumEyesFactory,
}
