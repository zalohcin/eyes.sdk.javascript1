'use strict';

/**
 * Encapsulates cutting logic.
 *
 * @interface
 */
class CutProvider {

    constructor() {
        if (new.target === CutProvider) {
            throw new TypeError("Can not construct `CutProvider` instance directly, should be used implementation!");
        }
    }

    // noinspection JSUnusedLocalSymbols, JSMethodCanBeStatic
    /**
     * @abstract
     * @param {MutableImage} image The image to cut.
     * @param {PromiseFactory} promiseFactory
     * @return {Promise<MutableImage>} A new cut image.
     */
    cut(image, promiseFactory) {
        throw new TypeError('The method `cut` from `CutProvider` should be implemented!');
    }

    // noinspection JSUnusedLocalSymbols, JSMethodCanBeStatic
    /**
     * Get a scaled version of the cut provider.
     *
     * @abstract
     * @param {Number} scaleRatio The ratio by which to scale the current cut parameters.
     * @return {CutProvider} A new scale cut provider instance.
     */
    scale(scaleRatio) {
        throw new TypeError('The method `scale` from `CutProvider` should be implemented!');
    }
}

module.exports = CutProvider;
