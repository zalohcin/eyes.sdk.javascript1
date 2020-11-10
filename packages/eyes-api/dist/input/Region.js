"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TypeUtils = require("../utils/TypeUtils");
const ArgumentGuard = require("../utils/ArgumentGuard");
class RegionData {
    constructor(regionOrLocationOrX, sizeOrY, width, height) {
        if (TypeUtils.isNumber(regionOrLocationOrX)) {
            const x = regionOrLocationOrX;
            const y = sizeOrY;
            return new RegionData({ x, y, width, height });
        }
        else if (!TypeUtils.has(regionOrLocationOrX, 'width')) {
            const { x, y } = TypeUtils.has(regionOrLocationOrX, 'left')
                ? { x: regionOrLocationOrX.left, y: regionOrLocationOrX.top }
                : regionOrLocationOrX;
            const { width, height } = sizeOrY;
            return new RegionData({ x, y, width, height });
        }
        const region = regionOrLocationOrX;
        if (TypeUtils.has(region, 'x')) {
            this.x = region.x;
            this.y = region.y;
        }
        else {
            this.x = region.left;
            this.y = region.top;
        }
        this.width = region.width;
        this.height = region.height;
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
    get left() {
        return this.x;
    }
    set left(left) {
        this.x = left;
    }
    getLeft() {
        return this.x;
    }
    setLeft(left) {
        this.x = left;
    }
    get top() {
        return this.y;
    }
    set top(top) {
        this.y = top;
    }
    getTop() {
        return this.y;
    }
    setTop(top) {
        this.y = top;
    }
    get width() {
        return this._width;
    }
    set width(width) {
        ArgumentGuard.isNumber(width, { name: 'width', gte: 0 });
        this._width = width;
    }
    getWidth() {
        return this._width;
    }
    setWidth(width) {
        this.width = width;
    }
    get height() {
        return this._height;
    }
    set height(height) {
        ArgumentGuard.isNumber(height, { name: 'height', gte: 0 });
        this._height = height;
    }
    getHeight() {
        return this._height;
    }
    setHeight(height) {
        this.height = height;
    }
}
exports.default = RegionData;
//# sourceMappingURL=Region.js.map