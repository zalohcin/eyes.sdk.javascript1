export declare type ProxySettings = {
    url: string;
    username?: string;
    password?: string;
    isHttpOnly?: boolean;
};
export default class ProxySettingsData implements Required<ProxySettings> {
    private _url;
    private _username;
    private _password;
    private _isHttpOnly;
    private _isDisabled;
    constructor(proxy: ProxySettings);
    constructor(url: string, username?: string, password?: string, isHttpOnly?: boolean);
    constructor(isDisabled: true);
    get url(): string;
    getUri(): string;
    get username(): string;
    getUsername(): string;
    get password(): string;
    getPassword(): string;
    get isHttpOnly(): boolean;
    getIsHttpOnly(): boolean;
    get isDisabled(): boolean;
    getIsDisabled(): boolean;
}
