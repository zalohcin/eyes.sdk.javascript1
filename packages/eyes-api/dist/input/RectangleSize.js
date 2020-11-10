"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TypeUtils = require("../utils/TypeUtils");
const ArgumentGuard = require("../utils/ArgumentGuard");
class RectangleSizeData {
    constructor(sizeOrWidth, height) {
        if (TypeUtils.isNumber(sizeOrWidth)) {
            return new RectangleSizeData({ width: sizeOrWidth, height });
        }
        const size = sizeOrWidth;
        this.width = size.width;
        this.height = size.height;
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
exports.default = RectangleSizeData;
//# sourceMappingURL=RectangleSize.js.map