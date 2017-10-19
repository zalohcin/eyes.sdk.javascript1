'use strict';

const {ArgumentGuard, PositionProvider, Location} = require('eyes.sdk');

const EyesSeleniumUtils = require('../EyesSeleniumUtils');
const ScrollPositionMemento = require('./ScrollPositionMemento');

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
        ArgumentGuard.notNull(promiseFactory, "promiseFactory");

        this._logger = logger;
        this._driver = executor;
        this._promiseFactory = promiseFactory;

        this._logger.verbose("creating ScrollPositionProvider");
    }

    /**
     * @override
     * @inheritDoc
     */
    getCurrentPosition() {
        this._logger.verbose("ScrollPositionProvider - getCurrentPosition()");

        const that = this;
        return EyesSeleniumUtils.getCurrentScrollPosition(this._driver, this._promiseFactory).then(result => {
            that._logger.verbose(`Current position: ${result}`);
            return result;
        });
    }

    /**
     * @override
     * @inheritDoc
     */
    setPosition(location) {
        const that = this;
        that._logger.verbose(`ScrollPositionProvider - Scrolling to ${location}`);
        return EyesSeleniumUtils.setCurrentScrollPosition(this._driver, location, this._promiseFactory).then(() => {
            that._logger.verbose("ScrollPositionProvider - Done scrolling!");
        });
    }

    /**
     * @override
     * @inheritDoc
     */
    getEntireSize() {
        const that = this;
        return EyesSeleniumUtils.getCurrentFrameContentEntireSize(this._driver, this._promiseFactory).then(result => {
            that._logger.verbose(`ScrollPositionProvider - Entire size: ${result}`);
            return result;
        });
    }

    /**
     * @override
     * @inheritDoc
     */
    getState() {
        return this.getCurrentPosition().then(position => new ScrollPositionMemento(position));
    }

    /**
     * @override
     * @inheritDoc
     */
    restoreState(state) {
        const that = this;
        /** @type {ScrollPositionMemento} state */
        return this.setPosition(new Location(state.getX(), state.getY())).then(() => {
            that._logger.verbose("Position restored.");
        });
    }
}

module.exports = ScrollPositionProvider;
