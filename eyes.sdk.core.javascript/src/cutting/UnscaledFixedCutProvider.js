'use strict';

const Region = require('../positioning/Region');
const CutProvider = require('./CutProvider');

class UnscaledFixedCutProvider extends CutProvider {

    /**
     * @param {Number} header The header to cut in pixels.
     * @param {Number} footer The footer to cut in pixels.
     * @param {Number} left The left to cut in pixels.
     * @param {Number} right The right to cut in pixels.
     */
    constructor(header, footer, left, right) {
        super();

        this._header = header;
        this._footer = footer;
        this._left = left;
        this._right = right;
    }

    /**
     *
     * @param {MutableImage} image The image to cut.
     * @param {PromiseFactory} promiseFactory
     * @return {Promise<MutableImage>} A new cut image.
     */
    cut(image, promiseFactory) {
        const that = this;
        let promise = promiseFactory.resolve();

        if (this._header > 0) {
            promise = promise.then(() => image.getSize()).then(imageSize => {
                const region = new Region(0, that._header, imageSize.getWidth(), imageSize.getHeight() - that._header);
                return image.cropImage(region);
            });
        }

        if (this._footer > 0) {
            promise = promise.then(() => image.getSize()).then(imageSize => {
                const region = new Region(0, 0, imageSize.getWidth(), imageSize.getHeight() - that._footer);
                return image.cropImage(region);
            });
        }

        if (this._left > 0) {
            promise = promise.then(() => image.getSize()).then(imageSize => {
                const region = new Region(that._left, 0, imageSize.getWidth() - that._left, imageSize.getHeight());
                return image.cropImage(region);
            });
        }

        if (this._right > 0) {
            promise = promise.then(() => image.getSize()).then(imageSize => {
                const region = new Region(0, 0, imageSize.getWidth() - that._right, imageSize.getHeight());
                return image.cropImage(region);
            });
        }

        return promise;
    }

    /**
     * Get a scaled version of the cut provider.
     *
     * @param {Number} scaleRatio The ratio by which to scale the current cut parameters.
     * @return {CutProvider} A new scale cut provider instance.
     */
    scale(scaleRatio) {
        return new UnscaledFixedCutProvider(this._header, this._footer, this._left, this._right);
    }
}

module.exports = UnscaledFixedCutProvider;
