'use strict';

class PropertyData {

    /**
     * @param {String} name
     * @param {String} value
     */
    constructor(name, value) {
        this._name = name;
        this._value = value;
    }

    getName() {
        return this._name;
    }

    setName(value) {
        this._name = value;
    }

    getValue() {
        return this._value;
    }

    setValue(value) {
        this._value = value;
    }

    toJSON() {
        return {
            name: this._name,
            value: this._value,
        };
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @return {String}
     */
    toString() {
        return `PropertyData { ${JSON.stringify(this)} }`;
    }
}

module.exports = PropertyData;
