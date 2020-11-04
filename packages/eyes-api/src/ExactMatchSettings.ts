import * as GeneralUtils from './utils/GeneralUtils'

export type PlainExactSettings = {
    minDiffIntensity: number;
    minDiffWidth: number;
    minDiffHeight: number;
    matchThreshold: number;
}


export default class ExactMatchSettings {
    private _minDiffIntensity: number;
    private _minDiffWidth: number;
    private _minDiffHeight: number;
    private _matchThreshold: number;

    constructor({ minDiffIntensity, minDiffWidth, minDiffHeight, matchThreshold }: PlainExactSettings) {
        if (arguments.length > 1) {
            throw new TypeError('Please, use object as a parameter to the constructor!')
        }

        this._minDiffIntensity = minDiffIntensity || 0
        this._minDiffWidth = minDiffWidth || 0
        this._minDiffHeight = minDiffHeight || 0
        this._matchThreshold = matchThreshold || 0
    }

    get minDiffIntensity(): number {
        return this._minDiffIntensity;
    }

    getMinDiffIntensity(): number {
        return this._minDiffIntensity
    }

    set minDiffIntensity(value: number) {
        this._minDiffIntensity = value;
    }

    setMinDiffIntensity(value: number) {
        this._minDiffIntensity = value
    }

    get minDiffWidth(): number {
        return this._minDiffWidth;
    }

    getMinDiffWidth() {
        return this._minDiffWidth
    }

    set minDiffWidth(value: number) {
        this._minDiffWidth = value;
    }

    setMinDiffWidth(value: number) {
        this._minDiffWidth = value;
    }

    get minDiffHeight(): number {
        return this._minDiffHeight;
    }

    getMinDiffHeight() {
        return this._minDiffHeight
    }

    set minDiffHeight(value: number) {
        this._minDiffHeight = value;
    }

    setMinDiffHeight(value: number) {
        this._minDiffHeight = value;
    }


    get matchThreshold(): number {
        return this._matchThreshold;
    }

    getMatchThreshold() {
        return this._matchThreshold
    }

    set matchThreshold(value: number) {
        this._matchThreshold = value;
    }

    setMatchThreshold(value: number) {
        this._matchThreshold = value
    }

}