export declare type ExactMatchSettings = {
    minDiffIntensity: number;
    minDiffWidth: number;
    minDiffHeight: number;
    matchThreshold: number;
};
export default class ExactMatchSettingsData implements Required<ExactMatchSettings> {
    private _minDiffIntensity;
    private _minDiffWidth;
    private _minDiffHeight;
    private _matchThreshold;
    constructor(settings: ExactMatchSettings);
    get minDiffIntensity(): number;
    set minDiffIntensity(value: number);
    getMinDiffIntensity(): number;
    setMinDiffIntensity(value: number): void;
    get minDiffWidth(): number;
    set minDiffWidth(value: number);
    getMinDiffWidth(): number;
    setMinDiffWidth(value: number): void;
    get minDiffHeight(): number;
    set minDiffHeight(value: number);
    getMinDiffHeight(): number;
    setMinDiffHeight(value: number): void;
    get matchThreshold(): number;
    set matchThreshold(value: number);
    getMatchThreshold(): number;
    setMatchThreshold(value: number): void;
}
