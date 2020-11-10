"use strict";
exports.__esModule = true;
var TypeUtils = require("../utils/TypeUtils");
var ArgumentGuard = require("../utils/ArgumentGuard");
var LocationData = /** @class */ (function () {
    function LocationData(locationOrX, y) {
        if (TypeUtils.isNumber(locationOrX)) {
            return new LocationData({ x: locationOrX, y: y });
        }
        this.x = locationOrX.x;
        this.y = locationOrX.y;
    }
    Object.defineProperty(LocationData.prototype, "x", {
        get: function () {
            return this._x;
        },
        set: function (x) {
            ArgumentGuard.isNumber(x, { name: 'x' });
            this._x = x;
        },
        enumerable: false,
        configurable: true
    });
    LocationData.prototype.getX = function () {
        return this._x;
    };
    LocationData.prototype.setX = function (x) {
        this.x = x;
    };
    Object.defineProperty(LocationData.prototype, "y", {
        get: function () {
            return this._y;
        },
        set: function (y) {
            ArgumentGuard.isNumber(y, { name: 'y' });
            this._y = y;
        },
        enumerable: false,
        configurable: true
    });
    LocationData.prototype.getY = function () {
        return this._y;
    };
    LocationData.prototype.setY = function (y) {
        this.y = y;
    };
    return LocationData;
}());
exports["default"] = LocationData;
