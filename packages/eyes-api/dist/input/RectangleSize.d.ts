export declare type RectangleSize = {
    width: number;
    height: number;
};
export default class RectangleSizeData implements Required<RectangleSize> {
    private _width;
    private _height;
    constructor(size: RectangleSize);
    constructor(width: number, height: number);
    get width(): number;
    set width(width: number);
    getWidth(): number;
    setWidth(width: number): void;
    get height(): number;
    set height(height: number);
    getHeight(): number;
    setHeight(height: number): void;
}
