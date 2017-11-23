'use strict';

const ArgumentGuard = require('../ArgumentGuard');

/**
 * @typedef {{width: number, height: number}} RectangleSizeObject
 */

/**
 * Represents a region.
 */
class RectangleSize {

    /**
     * Creates a RectangleSize instance.
     *
     * The constructor accept next attributes:
     * - (width: number, height: number): from `width` and `height` values
     * - (size: RectangleSize): from another instance of RectangleSize
     * - (object: {width: number, height: number}): from object
     *
     * @param {Number|RectangleSize|RectangleSizeObject} arg1 The width of the rectangle.
     * @param {Number} [arg2] The height of the rectangle.
     */
    constructor(arg1, arg2) {
        let width = arg1, height = arg2;

        if (arg1 instanceof Object) {
            if (arg1 instanceof RectangleSize) {
                width = arg1.getWidth();
                height = arg1.getHeight();
            } else if (arg1 instanceof Object) {
                ArgumentGuard.hasProperties(arg1, ['width', 'height'], 'RectangleSizeObject');

                width = arg1.width;
                height = arg1.height;
            } else {
                throw new TypeError("The constructor is not support the object " + arg1);
            }
        }

        ArgumentGuard.greaterThanOrEqualToZero(width, "width", true);
        ArgumentGuard.greaterThanOrEqualToZero(height, "height", true);

        this._width = width;
        this._height = height;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Parses a string into a {link RectangleSize} instance.
     *
     * @param {String} size A string representing width and height separated by "x".
     * @return {RectangleSize} An instance representing the input size.
     */
    static parse(size) {
        ArgumentGuard.notNull(size, "size");
        const parts = size.split("x");
        if (parts.length !== 2) {
            throw new Error(`IllegalArgument: Not a valid size string: ${size}`);
        }

        return new RectangleSize(parseInt(parts[0], 10), parseInt(parts[1], 10));
    }

    /**
     * @return {Number} The rectangle's width.
     */
    getWidth() {
        return this._width;
    }

    /**
     * @return {Number} The rectangle's height.
     */
    getHeight() {
        return this._height;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Indicates whether some other RectangleSize is "equal to" this one.
     *
     * @param {Object|RectangleSize} obj The reference object with which to compare.
     * @return {Boolean} {@code true} if this object is the same as the obj argument; {@code false} otherwise.
     */
    equals(obj) {
        if(typeof obj !== typeof this || !(obj instanceof RectangleSize)) {
            return false;
        }

        return this.getWidth() === obj.getWidth() && this.getHeight() === obj.getHeight();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Get a scaled version of the current size.
     *
     * @param {Number} scaleRatio The ratio by which to scale the results.
     * @return {RectangleSize} A scaled copy of the current size.
     */
    scale(scaleRatio) {
        return new RectangleSize(Math.ceil(this._width * scaleRatio), Math.ceil(this._height * scaleRatio));
    }

    toJSON() {
        return {
            width: this._width,
            height: this._height
        }
    }

    // noinspection JSUnusedGlobalSymbols
    toString() {
        return `${this._width}x${this._height}`;
    }
}

module.exports = RectangleSize;
