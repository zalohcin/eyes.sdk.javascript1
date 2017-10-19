'use strict';

const {ArgumentGuard, PositionProvider, RectangleSize, Location} = require('eyes.sdk');

class ElementPositionProvider extends PositionProvider {

    /**
     * @param {Logger} logger A Logger instance.
     * @param {EyesWebDriver} driver
     * @param {EyesRemoteWebElement} element
     * @param {PromiseFactory} promiseFactory
     */
    constructor(logger, driver, element, promiseFactory) {
        super();
        ArgumentGuard.notNull(logger, "logger");
        ArgumentGuard.notNull(driver, "executor");
        ArgumentGuard.notNull(element, "element");
        ArgumentGuard.notNull(promiseFactory, "promiseFactory");

        this._logger = logger;
        this._driver = driver;
        this._promiseFactory = promiseFactory;
        this._element = element;

        this._logger.verbose("creating ElementPositionProvider");
    }

    /**
     * @override
     * @inheritDoc
     */
    getCurrentPosition() {
        this._logger.verbose("getCurrentScrollPosition()");

        const that = this;
        let scrollLeft;
        return that._element.getScrollLeft().then(_scrollLeft => {
            scrollLeft = _scrollLeft;
            return that._element.getScrollTop();
        }).then(_scrollTop => {
            const location = new Location(scrollLeft, _scrollTop);
            that._logger.verbose(`Current position: ${location}`);
            return location;
        });
    }

    /**
     * @override
     * @inheritDoc
     */
    setPosition(location) {
        const that = this;
        that._logger.verbose(`Scrolling element to: ${location}`);
        return that._element.scrollTo(location).then(() => {
            that._logger.verbose("Done scrolling element!");
        });
    }

    /**
     * @override
     * @inheritDoc
     */
    getEntireSize() {
        this._logger.verbose("ElementPositionProvider - getEntireSize()");

        const that = this;
        let scrollWidth;
        return that._element.getScrollWidth().then(_scrollWidth => {
            scrollWidth = _scrollWidth;
            return that._element.getScrollHeight();
        }).then(_scrollHeight => {
            const size = new RectangleSize(scrollWidth, _scrollHeight);
            that._logger.verbose(`ElementPositionProvider - Entire size: ${size}`);
            return size;
        });
    }

    /**
     * @override
     * @inheritDoc
     */
    getState() {
        return this.getCurrentPosition();
    }

    /**
     * @override
     * @inheritDoc
     */
    restoreState(state) {
        const that = this;
        return this.setPosition(state).then(() => {
            that._logger.verbose("Position restored.");
        });
    }
}

module.exports = ElementPositionProvider;