export declare type CustomProperty = {
    name: string;
    value: string;
};
export default class CustomPropertyData implements Required<CustomProperty> {
    private _name;
    private _value;
    constructor(prop: CustomProperty);
    constructor(name: string, value: string);
    get name(): string;
    getName(): string;
    setName(name: string): void;
    get value(): string;
    getValue(): string;
    setValue(value: string): void;
}
