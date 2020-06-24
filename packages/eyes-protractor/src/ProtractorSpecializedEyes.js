const {EyesFactory, EyesClassic, EyesVisualGrid} = require('@applitools/eyes-sdk-core')
const VisualGridClient = require('@applitools/visual-grid-client')
const WrappedDriver = require('./ProtractorWrappedDriver')
const WrappedElement = require('./ProtractorWrappedElement')
const CheckSettings = require('./ProtractorCheckSettings')

const {version} = require('../package.json')

/**
 * @typedef {import('./SpecWrappedDriver').Driver} ProtractorDriver
 * @typedef {import('./SpecWrappedElement').Element} ProtractorElement
 * @typedef {import('./SpecWrappedElement').Selector} ProtractorSelector
 */

/** @type {EyesClassic<ProtractorDriver, ProtractorElement, ProtractorSelector>} */
const ProtractorEyesClassic = EyesClassic.specialize({
  agentId: `eyes-protractor/${version}`,
  WrappedDriver,
  WrappedElement,
  CheckSettings,
})

/** @type {EyesVisualGrid<ProtractorDriver, ProtractorElement, ProtractorSelector>} */
const ProtractorEyesVisualGrid = EyesVisualGrid.specialize({
  agentId: `eyes-protractor.visualgrid/${version}`,
  WrappedDriver,
  WrappedElement,
  CheckSettings,
  VisualGridClient,
})

/** @type {EyesFactory<ProtractorDriver, ProtractorElement, ProtractorSelector>} */
const ProtractorEyesFactory = EyesFactory.specialize({
  EyesClassic: ProtractorEyesClassic,
  EyesVisualGrid: ProtractorEyesVisualGrid,
})

module.exports = {
  ProtractorEyesClassic,
  ProtractorEyesVisualGrid,
  ProtractorEyesFactory,
}
