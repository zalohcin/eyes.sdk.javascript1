'use strict';

/**
 * Encapsulates getter/setter behavior. (e.g., set only once etc.).
 *
 * @interface
 **/
class PropertyHandler {

    constructor() {
        if (new.target === PropertyHandler) {
            throw new TypeError("Cannot construct Abstract instances directly");
        }
    }

    /**
     * @abstract
     * @param {*} obj The object to set.
     * @return {boolean|void} {@code true} if the object was set, {@code false} otherwise.
     */
    set(obj) {}

    /**
     * @abstract
     * @return {*} The object that was set. (Note that object might also be set in the constructor of an implementation class).
     */
    get() {}
}

module.exports = PropertyHandler;
