'use strict'

const {RegionVisibilityStrategy} = require('./RegionVisibilityStrategy')

/**
 * @ignore
 */
class NopRegionVisibilityStrategy extends RegionVisibilityStrategy {
  /**
   * @param {Logger} logger
   */
  constructor(logger) {
    super()

    this._logger = logger
  }

  /**
   * @inheritDoc
   */
  async moveToRegion(_positionProvider, _location) {
    this._logger.verbose('Ignored (no op).')
  }

  /**
   * @inheritDoc
   */
  async returnToOriginalPosition(_positionProvider) {
    this._logger.verbose('Ignored (no op).')
  }
}

exports.NopRegionVisibilityStrategy = NopRegionVisibilityStrategy
