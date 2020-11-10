"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ExactMatchSettingsData {
    constructor(settings) {
        this._minDiffIntensity = settings.minDiffIntensity || 0;
        this._minDiffWidth = settings.minDiffWidth || 0;
        this._minDiffHeight = settings.minDiffHeight || 0;
        this._matchThreshold = settings.matchThreshold || 0;
    }
    get minDiffIntensity() {
        return this._minDiffIntensity;
    }
    set minDiffIntensity(value) {
        this._minDiffIntensity = value;
    }
    getMinDiffIntensity() {
        return this._minDiffIntensity;
    }
    setMinDiffIntensity(value) {
        this._minDiffIntensity = value;
    }
    get minDiffWidth() {
        return this._minDiffWidth;
    }
    set minDiffWidth(value) {
        this._minDiffWidth = value;
    }
    getMinDiffWidth() {
        return this._minDiffWidth;
    }
    setMinDiffWidth(value) {
        this._minDiffWidth = value;
    }
    get minDiffHeight() {
        return this._minDiffHeight;
    }
    set minDiffHeight(value) {
        this._minDiffHeight = value;
    }
    getMinDiffHeight() {
        return this._minDiffHeight;
    }
    setMinDiffHeight(value) {
        this._minDiffHeight = value;
    }
    get matchThreshold() {
        return this._matchThreshold;
    }
    set matchThreshold(value) {
        this._matchThreshold = value;
    }
    getMatchThreshold() {
        return this._matchThreshold;
    }
    setMatchThreshold(value) {
        this._matchThreshold = value;
    }
}
exports.default = ExactMatchSettingsData;
//# sourceMappingURL=ExactMatchSettings.js.map