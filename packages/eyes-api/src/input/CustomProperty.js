"use strict";
exports.__esModule = true;
var TypeUtils = require("../utils/TypeUtils");
var ArgumentGuard = require("../utils/ArgumentGuard");
var CustomPropertyData = /** @class */ (function () {
    function CustomPropertyData(propOrName, value) {
        if (TypeUtils.isString(propOrName)) {
            return new CustomPropertyData({ name: propOrName, value: value });
        }
        var prop = propOrName;
        ArgumentGuard.isString(prop.name, { name: 'prop.name' });
        ArgumentGuard.notNull(prop.value, { name: 'prop.value' });
        this._name = prop.name;
        this._value = prop.value;
    }
    Object.defineProperty(CustomPropertyData.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: false,
        configurable: true
    });
    CustomPropertyData.prototype.getName = function () {
        return this._name;
    };
    CustomPropertyData.prototype.setName = function (name) {
        this._name = name;
    };
    Object.defineProperty(CustomPropertyData.prototype, "value", {
        get: function () {
            return this._value;
        },
        enumerable: false,
        configurable: true
    });
    CustomPropertyData.prototype.getValue = function () {
        return this._value;
    };
    CustomPropertyData.prototype.setValue = function (value) {
        this._value = value;
    };
    return CustomPropertyData;
}());
exports["default"] = CustomPropertyData;
