const {EyesFactory, EyesClassic, EyesVisualGrid} = require('@applitools/eyes-sdk-core')
const VisualGridClient = require('@applitools/visual-grid-client')
const WrappedDriver = require('./WDIOWrappedDriver')
const WrappedElement = require('./WDIOWrappedElement')
const CheckSettings = require('./WDIOCheckSettings')

const {version} = require('../package.json')

/**
 * @typedef {import('./SpecWrappedDriver').Driver} WDIODriver
 * @typedef {import('./SpecWrappedElement').Element} WDIOElement
 * @typedef {import('./SpecWrappedElement').Selector} WDIOSelector
 */

/** @type {EyesClassic<WDIODriver, WDIOElement, WDIOSelector>} */
const WDIOEyesClassic = EyesClassic.specialize({
  agentId: `eyes.webdriverio/${version}`,
  WrappedDriver,
  WrappedElement,
  CheckSettings,
})

/** @type {EyesVisualGrid<WDIODriver, WDIOElement, WDIOSelector>} */
const WDIOEyesVisualGrid = EyesVisualGrid.specialize({
  agentId: `eyes.webdriverio.visualgrid/${version}`,
  WrappedDriver,
  WrappedElement,
  CheckSettings,
  VisualGridClient,
})

/** @type {EyesFactory<WDIODriver, WDIOElement, WDIOSelector>} */
const WDIOEyesFactory = EyesFactory.specialize({
  EyesClassic: WDIOEyesClassic,
  EyesVisualGrid: WDIOEyesVisualGrid,
})

module.exports = {
  WDIOEyesClassic,
  WDIOEyesVisualGrid,
  WDIOEyesFactory,
}
