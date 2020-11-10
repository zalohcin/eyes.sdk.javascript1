"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TypeUtils = require("../utils/TypeUtils");
const ArgumentGuard = require("../utils/ArgumentGuard");
class LocationData {
    constructor(locationOrX, y) {
        if (TypeUtils.isNumber(locationOrX)) {
            return new LocationData({ x: locationOrX, y });
        }
        this.x = locationOrX.x;
        this.y = locationOrX.y;
    }
    get x() {
        return this._x;
    }
    set x(x) {
        ArgumentGuard.isNumber(x, { name: 'x' });
        this._x = x;
    }
    getX() {
        return this._x;
    }
    setX(x) {
        this.x = x;
    }
    get y() {
        return this._y;
    }
    set y(y) {
        ArgumentGuard.isNumber(y, { name: 'y' });
        this._y = y;
    }
    getY() {
        return this._y;
    }
    setY(y) {
        this.y = y;
    }
}
exports.default = LocationData;
//# sourceMappingURL=Location.js.map