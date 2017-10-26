'use strict';

const DEFAULT_PREFIX = "screenshot_";
const DEFAULT_PATH = "";

/**
 * Interface for saving debug screenshots.
 *
 * @abstract
 */
class DebugScreenshotsProvider {

    constructor() {
        this._prefix = DEFAULT_PREFIX;
        this._path = null;
    }


    getPrefix() {
        return this._prefix;
    }

    setPrefix(value) {
        this._prefix = value || DEFAULT_PREFIX;
    }

    getPath() {
        return this._path;
    }

    setPath(value) {
        if (value) {
            value = value.endsWith("/") ? value : value + '/';
        } else {
            value = DEFAULT_PATH;
        }

        this._path = value;
    }

    // noinspection JSMethodCanBeStatic, JSUnusedGlobalSymbols
    /**
     * @abstract
     * @param {MutableImage} image
     * @param {String} suffix
     * @return {Promise.<void>}
     */
    save(image, suffix) {
        throw new TypeError('The method `save` from `DebugScreenshotsProvider` should be implemented!');
    }
}

module.exports = DebugScreenshotsProvider;
