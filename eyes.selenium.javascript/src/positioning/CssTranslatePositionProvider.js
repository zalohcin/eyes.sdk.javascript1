'use strict';

const {PositionProvider, ArgumentGuard} = require('eyes.sdk');

const EyesSeleniumUtils = require('../EyesSeleniumUtils');

class CssTranslatePositionProvider extends PositionProvider {

    /**
     * @param {Logger} logger A Logger instance.
     * @param {EyesWebDriver} executor
     * @param {PromiseFactory} promiseFactory
     */
    constructor(logger, executor, promiseFactory) {
        super();
        ArgumentGuard.notNull(logger, "logger");
        ArgumentGuard.notNull(executor, "executor");

        this._logger = logger;
        this._driver = executor;
        this._promiseFactory = promiseFactory;
        this._lastSetPosition = null;
    }

    /**
     * @return {Promise<{x: number, y: number}>} The scroll position of the current frame.
     */
    getCurrentPosition() {
        const that = this;
        return that._promiseFactory.makePromise(resolve => {
            that._logger.verbose("getCurrentPosition()");
            that._logger.verbose("position to return: ", that._lastSetPosition);
            resolve(that._lastSetPosition);
        });
    }

    /**
     * Go to the specified location.
     * @param {{x: number, y: number}} location The position to scroll to.
     * @return {Promise<void>}
     */
    setPosition(location) {
        const that = this;
        that._logger.verbose("Setting position to:", location);
        return EyesSeleniumUtils.translateTo(this._driver, location, this._promiseFactory).then(() => {
            that._logger.verbose("Done!");
            that._lastSetPosition = location;
        });
    }

    /**
     * @return {Promise<{width: number, height: number}>} The entire size of the container which the position is relative to.
     */
    getEntireSize() {
        const that = this;
        return EyesSeleniumUtils.getEntirePageSize(this._driver, this._promiseFactory).then(result => {
            that._logger.verbose("Entire size: ", result);
            return result;
        });
    }

    /**
     * @return {Promise<object.<string, string>>}
     */
    getState() {
        const that = this;
        return EyesSeleniumUtils.getCurrentTransform(this._driver, this._promiseFactory).then(transforms => {
            that._logger.verbose("Current transform", transforms);
            return transforms;
        });
    }

    /**
     * @param {object.<string, string>} state The initial state of position
     * @return {Promise<void>}
     */
    restoreState(state) {
        const that = this;
        return EyesSeleniumUtils.setTransforms(this._driver, state, this._promiseFactory).then(() => {
            that._logger.verbose("Transform (position) restored.");
        });
    }
}

module.exports = CssTranslatePositionProvider;