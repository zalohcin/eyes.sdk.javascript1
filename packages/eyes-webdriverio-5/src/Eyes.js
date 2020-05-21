const {EyesFactory, EyesClassic, EyesVisualGrid} = require('@applitools/eyes-sdk-core')
const {DomCapture} = require('@applitools/dom-utils')
const VisualGridClient = require('@applitools/visual-grid-client')
const WrappedDriver = require('./WDIOWrappedDriver')
const WrappedElement = require('./WDIOWrappedElement')
const CheckSettings = require('./WDIOCheckSettings')

const {version} = require('../package.json')

const WDIOEyesClassic = EyesClassic.specialize({
  agentId: `eyes.webdriverio/${version}`,
  WrappedDriver,
  WrappedElement,
  CheckSettings,
  DomCapture,
})
const WDIOEyesVisualGrid = EyesVisualGrid.specialize({
  agentId: `eyes.webdriverio.visualgrid/${version}`,
  WrappedDriver,
  WrappedElement,
  CheckSettings,
  VisualGridClient,
})
const WDIOEyesFactory = EyesFactory.specialize({
  EyesClassic: WDIOEyesClassic,
  EyesVisualGrid: WDIOEyesVisualGrid,
})

module.exports = {
  WDIOEyesClassic,
  WDIOEyesVisualGrid,
  WDIOEyesFactory,
}
