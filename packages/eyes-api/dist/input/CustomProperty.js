"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TypeUtils = require("../utils/TypeUtils");
const ArgumentGuard = require("../utils/ArgumentGuard");
class CustomPropertyData {
    constructor(propOrName, value) {
        if (TypeUtils.isString(propOrName)) {
            return new CustomPropertyData({ name: propOrName, value });
        }
        const prop = propOrName;
        ArgumentGuard.isString(prop.name, { name: 'prop.name' });
        ArgumentGuard.notNull(prop.value, { name: 'prop.value' });
        this._name = prop.name;
        this._value = prop.value;
    }
    get name() {
        return this._name;
    }
    getName() {
        return this._name;
    }
    setName(name) {
        this._name = name;
    }
    get value() {
        return this._value;
    }
    getValue() {
        return this._value;
    }
    setValue(value) {
        this._value = value;
    }
}
exports.default = CustomPropertyData;
//# sourceMappingURL=CustomProperty.js.map