'use strict';

const { Location } = require('@applitools/eyes.sdk.core');

const RegionVisibilityStrategy = require('./RegionVisibilityStrategy');

const VISIBILITY_OFFSET = 100; // Pixels

class MoveToRegionVisibilityStrategy extends RegionVisibilityStrategy {
  /**
   * @param {Logger} logger
   * @param {PromiseFactory} promiseFactory
   */
  constructor(logger, promiseFactory) {
    super();

    this._logger = logger;
    this._promiseFactory = promiseFactory;
    /** @type {PositionMemento} */
    this._originalPosition = null;
  }

  /**
   * @override
   * @inheritDoc
   */
  moveToRegion(positionProvider, location) {
    this._logger.verbose('Getting current position state..');

    const that = this;
    return positionProvider.getState()
      .then(originalPosition_ => {
        that._originalPosition = originalPosition_;
        that._logger.verbose('Done! Setting position..');

        // We set the location to "almost" the location we were asked. This is because sometimes, moving the browser
        // to the specific pixel where the element begins, causes the element to be slightly out of the viewport.
        let dstX = location.getX() - VISIBILITY_OFFSET;
        dstX = dstX < 0 ? 0 : dstX;
        let dstY = location.getY() - VISIBILITY_OFFSET;
        dstY = dstY < 0 ? 0 : dstY;

        return this._positionProvider.setPosition(new Location(dstX, dstY));
      })
      .then(() => {
        that._logger.verbose('Done!');
      });
  }

  /**
   * @override
   * @inheritDoc
   */
  returnToOriginalPosition(positionProvider) {
    this._logger.verbose('Returning to original position...');

    const that = this;
    return positionProvider.restoreState(this._originalPosition).then(() => {
      that._logger.verbose('Done!');
    });
  }
}

module.exports = MoveToRegionVisibilityStrategy;
