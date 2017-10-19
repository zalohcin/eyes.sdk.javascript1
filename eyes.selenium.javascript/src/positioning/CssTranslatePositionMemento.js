'use strict';

const {PositionMemento, Location} = require('eyes.sdk');

/**
 * Encapsulates state for {@link CssTranslatePositionProvider} instances.
 */
class CssTranslatePositionMemento extends PositionMemento {

    /**
     * @param {Map<String, String>} transforms The current transforms. The keys are the style keys from which each of the transforms were taken.
     */
    constructor(transforms) {
        super();

        this._transforms = transforms;
    }

    /**
     * @return {Map<String, String>} The current transforms. The keys are the style keys from which each of the transforms were taken.
     */
    getTransform() {
        return this._transforms;
    }
}

module.exports = CssTranslatePositionMemento;
