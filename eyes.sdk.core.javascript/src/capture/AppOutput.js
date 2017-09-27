'use strict';

/**
 * An application output (title, image, etc).
 */
class AppOutput {

    /**
     * @param {String} title The title of the screen of the application being captured.
     * @param {Buffer} screenshot64 Base64 encoding of the screenshot's bytes (the byte can be in either in compressed or uncompressed form)
     */
    constructor(title, screenshot64) {
        this._title = title;
        this._screenshot64 = screenshot64;
    }

    getTitle() {
        return this._title;
    }

    getScreenshot64() {
        return this._screenshot64;
    }
}

module.exports = AppOutput;
