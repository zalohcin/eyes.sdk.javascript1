'use strict';

/**
 * Encapsulates floating match settings for the a session.
 */
class FloatingMatchSettings {

    constructor(left, top, width, height, maxUpOffset, maxDownOffset, maxLeftOffset, maxRightOffset) {
        this._top = top;
        this._left = left;
        this._width = width;
        this._height = height;

        this._maxUpOffset = maxUpOffset;
        this._maxDownOffset = maxDownOffset;
        this._maxLeftOffset = maxLeftOffset;
        this._maxRightOffset = maxRightOffset;
    }

    getLeft() {
        return this._left;
    }

    setLeft(value) {
        this._left = value;
    }

    getTop() {
        return this._top;
    }

    setTop(value) {
        this._top = value;
    }

    getWidth() {
        return this._width;
    }

    setWidth(value) {
        this._width = value;
    }

    getHeight() {
        return this._height;
    }

    setHeight(value) {
        this._height = value;
    }

    getMaxUpOffset() {
        return this._maxUpOffset;
    }

    setMaxUpOffset(value) {
        this._maxUpOffset = value;
    }

    getMaxDownOffset() {
        return this._maxDownOffset;
    }

    setMaxDownOffset(value) {
        this._maxDownOffset = value;
    }

    getMaxLeftOffset() {
        return this._maxLeftOffset;
    }

    setMaxLeftOffset(value) {
        this._maxLeftOffset = value;
    }

    getMaxRightOffset() {
        return this._maxRightOffset;
    }

    setMaxRightOffset(value) {
        this._maxRightOffset = value;
    }

    toString() {
        return `FloatingMatchSettings: left: ${this._left}, top: ${this._top}, width: ${this._width}, height: ${this._height}, ` +
                `maxUpOffset: ${this._maxUpOffset}, maxDownOffset: ${this._maxDownOffset}, maxLeftOffset: ${this._maxLeftOffset}, maxRightOffset: ${this._maxRightOffset}, `;
    }
}

module.exports = FloatingMatchSettings;
