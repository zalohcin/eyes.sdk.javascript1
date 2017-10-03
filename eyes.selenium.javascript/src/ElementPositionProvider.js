'use strict';

const {ArgumentGuard, PositionProvider} = require('../node_modules/eyes.sdk');

class ElementPositionProvider extends PositionProvider {

    /**
     * @param {Logger} logger A Logger instance.
     * @param {EyesWebDriver} eyesDriver
     * @param {EyesRemoteWebElement} element
     * @param {PromiseFactory} promiseFactory
     */
    constructor(logger, eyesDriver, element, promiseFactory) {
        super();

        ArgumentGuard.notNull(logger, "logger");
        ArgumentGuard.notNull(eyesDriver, "executor");
        ArgumentGuard.notNull(element, "element");

        this._logger = logger;
        this._eyesDriver = eyesDriver;
        this._promiseFactory = promiseFactory;
        this._element = element;
    }

    /**
     * @return {Promise<{x: number, y: number}>} The scroll position of the current frame.
     */
    getCurrentPosition() {
        const that = this;
        let elScrollLeft;
        that._logger.verbose("getCurrentPosition()");

        return that._element.getScrollLeft().then(value => {
            elScrollLeft = value;
            return that._element.getScrollTop();
        }).then(value => {
            const location = { x: elScrollLeft, y: value };
            that._logger.verbose("Current position: ", location);
            return location;
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
        return that._element.scrollTo(location).then(() => {
            that._logger.verbose("Done scrolling!");
        });
    }

    /**
     * @return {Promise<{width: number, height: number}>} The entire size of the container which the position is relative to.
     */
    getEntireSize() {
        const that = this;
        let elScrollWidth;
        let elScrollHeight;
        that._logger.verbose("getEntireSize()");
        return that._element.getScrollWidth().then(value => {
            elScrollWidth = value;
            return that._element.getScrollHeight();
        }).then(value => {
            elScrollHeight = value;

            that._logger.verbose("Entire size: ", elScrollWidth, ",", elScrollHeight);

            return {
                width: elScrollWidth,
                height: elScrollHeight
            };
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

module.exports = ElementPositionProvider;