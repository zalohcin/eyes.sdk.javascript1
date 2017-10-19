'use strict';

/**
 * Encapsulates page/element positioning.
 *
 * @interface
 */
class PositionProvider {

    constructor() {
        if (new.target === PositionProvider) {
            throw new TypeError("Can not construct `PositionProvider` instance directly, should be used implementation!");
        }
    }

    // noinspection JSMethodCanBeStatic
    /**
     * @abstract
     * @return {Promise<Location>} The current position, or {@code null} if position is not available.
     */
    getCurrentPosition() {
        throw new TypeError('The method `getCurrentPosition` from `PositionProvider` should be implemented!');
    }

    // noinspection JSUnusedLocalSymbols, JSMethodCanBeStatic
    /**
     * Go to the specified location.
     *
     * @abstract
     * @param {Location} location The position to set.
     */
    setPosition(location) {
        throw new TypeError('The method `setPosition` from `PositionProvider` should be implemented!');
    }

    // noinspection JSMethodCanBeStatic
    /**
     * @abstract
     * @return {Promise<RectangleSize>} The entire size of the container which the position is relative to.
     */
    getEntireSize() {
        throw new TypeError('The method `getEntireSize` from `PositionProvider` should be implemented!');
    }

    // noinspection JSMethodCanBeStatic
    /**
     * @abstract
     * @return {Promise<PositionMemento>}
     */
    getState() {
        throw new TypeError('The method `getState` from `PositionProvider` should be implemented!');
    }

    // noinspection JSUnusedLocalSymbols, JSMethodCanBeStatic
    /**
     * @abstract
     * @param {PositionMemento} state The initial state of position
     * @return {Promise<void>}
     */
    restoreState(state) {
        throw new TypeError('The method `restoreState` from `PositionProvider` should be implemented!');
    }
}

module.exports = PositionProvider;
