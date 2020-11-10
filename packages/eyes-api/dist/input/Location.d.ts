export declare type Location = {
    x: number;
    y: number;
};
export default class LocationData implements Required<Location> {
    private _x;
    private _y;
    constructor(location: Location);
    constructor(x: number, y: number);
    get x(): number;
    set x(x: number);
    getX(): number;
    setX(x: number): void;
    get y(): number;
    set y(y: number);
    getY(): number;
    setY(y: number): void;
}
