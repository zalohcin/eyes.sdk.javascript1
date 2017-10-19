'use strict';

const {PositionProvider, ArgumentGuard} = require('eyes.sdk');

const EyesSeleniumUtils = require('../EyesSeleniumUtils');
const CssTranslatePositionMemento = require('./CssTranslatePositionMemento');

/**
 * A {@link PositionProvider} which is based on CSS translates. This is
 * useful when we want to stitch a page which contains fixed position elements.
 */
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
        ArgumentGuard.notNull(promiseFactory, "promiseFactory");

        this._logger = logger;
        this._driver = executor;
        this._promiseFactory = promiseFactory;
        this._lastSetPosition = undefined;

        this._logger.verbose("creating CssTranslatePositionProvider");
    }

    /**
     * @override
     * @inheritDoc
     */
    getCurrentPosition() {
        this._logger.verbose("position to return: ", this._lastSetPosition);
        return this._promiseFactory.resolve(this._lastSetPosition);
    }

    /**
     * @override
     * @inheritDoc
     */
    setPosition(location) {
        try {
            ArgumentGuard.notNull(location, "location");
        } catch (err) {
            return this._promiseFactory.reject(err);
        }

        const that = this;
        this._logger.verbose(`CssTranslatePositionProvider - Setting position to: ${location}`);
        return EyesSeleniumUtils.translateTo(this._driver, location, this._promiseFactory).then(() => {
            that._logger.verbose("Done!");
            that._lastSetPosition = location;
        });
    }

    /**
     * @override
     * @inheritDoc
     */
    getEntireSize() {
        const that = this;
        return EyesSeleniumUtils.getCurrentFrameContentEntireSize(this._driver, this._promiseFactory).then(entireSize => {
            that._logger.verbose(`CssTranslatePositionProvider - Entire size: ${entireSize}`);
            return entireSize;
        });
    }

    /**
     * @override
     * @inheritDoc
     */
    getState() {
        const that = this;
        return EyesSeleniumUtils.getCurrentTransform(this._driver, this._promiseFactory).then(transforms => {
            that._logger.verbose("Current transform", transforms);
            return new CssTranslatePositionMemento(transforms());
        });
    }

    /**
     * @override
     * @inheritDoc
     */
    restoreState(state) {
        const that = this;
        /** @type {CssTranslatePositionMemento} state */
        return EyesSeleniumUtils.setTransforms(this._driver, state.getTransform(), this._promiseFactory).then(() => {
            that._logger.verbose("Transform (position) restored.");
        });
    }
}

module.exports = CssTranslatePositionProvider;