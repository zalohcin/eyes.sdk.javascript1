'use strict';

const RegionVisibilityStrategy = require('./RegionVisibilityStrategy');

class NopRegionVisibilityStrategy extends RegionVisibilityStrategy {

    // noinspection JSCommentMatchesSignature
    /**
     * @param {Logger} logger
     * @param {PromiseFactory} promiseFactory
     */
    constructor(logger, promiseFactory) {
        super();

        this._logger = logger;
        this._promiseFactory = promiseFactory;
    }

    /**
     * @override
     * @inheritDoc
     */
    moveToRegion(positionProvider, location) {
        this._logger.verbose("Ignored (no op).");
        return this._promiseFactory.resolve();
    }

    /**
     * @override
     * @inheritDoc
     */
    returnToOriginalPosition(positionProvider) {
        this._logger.verbose("Ignored (no op).");
        return this._promiseFactory.resolve();
    }
}

module.exports = NopRegionVisibilityStrategy;
