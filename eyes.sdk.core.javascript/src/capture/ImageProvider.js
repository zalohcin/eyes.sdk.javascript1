'use strict';

/**
 * Encapsulates image retrieval.
 *
 * @interface
 */
class ImageProvider {

    constructor() {
        if (new.target === ImageProvider) {
            throw new TypeError("Can not construct `ImageProvider` instance directly, should be used implementation!");
        }
    }

    // noinspection JSMethodCanBeStatic, JSUnusedGlobalSymbols
    /**
     * @abstract
     * @return {Promise.<MutableImage>}
     */
    getImage() {
        throw new TypeError('The method `getImage` from `ImageProvider` should be implemented!');
    }
}

module.exports = ImageProvider;
