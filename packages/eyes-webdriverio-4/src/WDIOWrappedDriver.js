const {EyesWrappedDriver} = require('@applitools/eyes-sdk-core')
const SpecWrappedDriver = require('./SpecWrappedDriver')
const LegacyWrappedDriver = require('./LegacyWrappedDriver')

class WDIOWrappedDriver extends EyesWrappedDriver.specialize(SpecWrappedDriver) {
  /** @override */
  async frame(reference) {
    return this._context.frame(reference)
  }
  /** @override */
  async frameParent() {
    return this._context.frameParent()
  }
  /** @override */
  async url(url) {
    this._context.reset()
    return this.specs.visit(this.unwrapped, url)
  }
}

module.exports = LegacyWrappedDriver(WDIOWrappedDriver)
