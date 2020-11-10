"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ArgumentGuard = require("../utils/ArgumentGuard");
const TypeUtils = require("../utils/TypeUtils");
class ProxySettingsData {
    constructor(proxyOrUrlOrIsDisabled, username, password, isHttpOnly) {
        ArgumentGuard.notNull(proxyOrUrlOrIsDisabled, { name: 'proxyOrUrlOrIsDisabled' });
        if (proxyOrUrlOrIsDisabled === true) {
            this._isDisabled = true;
        }
        else {
            if (TypeUtils.isString(proxyOrUrlOrIsDisabled)) {
                return new ProxySettingsData({ url: proxyOrUrlOrIsDisabled, username, password, isHttpOnly });
            }
            this._url = proxyOrUrlOrIsDisabled.url;
            this._username = proxyOrUrlOrIsDisabled.username;
            this._password = proxyOrUrlOrIsDisabled.password;
            this._isHttpOnly = proxyOrUrlOrIsDisabled.isHttpOnly;
            this._isDisabled = false;
        }
    }
    get url() {
        return this._url;
    }
    getUri() {
        return this.url;
    }
    get username() {
        return this._username;
    }
    getUsername() {
        return this._username;
    }
    get password() {
        return this._password;
    }
    getPassword() {
        return this._password;
    }
    get isHttpOnly() {
        return this._isHttpOnly;
    }
    getIsHttpOnly() {
        return this._isHttpOnly;
    }
    get isDisabled() {
        return this._isDisabled;
    }
    getIsDisabled() {
        return this._isDisabled;
    }
}
exports.default = ProxySettingsData;
//# sourceMappingURL=ProxySettings.js.map