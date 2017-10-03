'use strict';

const {ArgumentGuard, PositionProvider} = require('../node_modules/eyes.sdk');

const EyesSeleniumUtils = require('./EyesSeleniumUtils');

class ScrollPositionProvider extends PositionProvider {

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
    }

    /**
     * @return {Promise<{x: number, y: number}>} The scroll position of the current frame.
     */
    getCurrentPosition() {
        const that = this;
        that._logger.verbose("getCurrentScrollPosition()");
        return EyesSeleniumUtils.getCurrentScrollPosition(this._driver, this._promiseFactory).then(result => {
            that._logger.verbose("Current position: ", result);
            return result;
        });
    }

    /**
     * Go to the specified location.
     * @param {{x: number, y: number}} location The position to scroll to.
     * @return {Promise<void>}
     */
    setPosition(location) {
        const that = this;
        that._logger.verbose("Scrolling to:", location);
        return EyesSeleniumUtils.scrollTo(this._driver, location, this._promiseFactory).then(() => {
            that._logger.verbose("Done scrolling!");
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
     * @return {Promise<{x: number, y: number}>}
     */
    getState() {
        return this.getCurrentPosition();
    }

    /**
     * @param {{x: number, y: number}} state The initial state of position
     * @return {Promise<void>}
     */
    restoreState(state) {
        const that = this;
        return this.setPosition(state).then(() => {
            that._logger.verbose("Position restored.");
        });
    }
}

module.exports = ScrollPositionProvider;
