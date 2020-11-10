"use strict";
exports.__esModule = true;
var ArgumentGuard = require("../utils/ArgumentGuard");
var TypeUtils = require("../utils/TypeUtils");
var ProxySettingsData = /** @class */ (function () {
    function ProxySettingsData(proxyOrUrlOrIsDisabled, username, password, isHttpOnly) {
        ArgumentGuard.notNull(proxyOrUrlOrIsDisabled, { name: 'proxyOrUrlOrIsDisabled' });
        if (proxyOrUrlOrIsDisabled === true) {
            this._isDisabled = true;
        }
        else {
            if (TypeUtils.isString(proxyOrUrlOrIsDisabled)) {
                return new ProxySettingsData({ url: proxyOrUrlOrIsDisabled, username: username, password: password, isHttpOnly: isHttpOnly });
            }
            this._url = proxyOrUrlOrIsDisabled.url;
            this._username = proxyOrUrlOrIsDisabled.username;
            this._password = proxyOrUrlOrIsDisabled.password;
            this._isHttpOnly = proxyOrUrlOrIsDisabled.isHttpOnly;
            this._isDisabled = false;
        }
    }
    Object.defineProperty(ProxySettingsData.prototype, "url", {
        get: function () {
            return this._url;
        },
        enumerable: false,
        configurable: true
    });
    ProxySettingsData.prototype.getUri = function () {
        return this.url;
    };
    Object.defineProperty(ProxySettingsData.prototype, "username", {
        get: function () {
            return this._username;
        },
        enumerable: false,
        configurable: true
    });
    ProxySettingsData.prototype.getUsername = function () {
        return this._username;
    };
    Object.defineProperty(ProxySettingsData.prototype, "password", {
        get: function () {
            return this._password;
        },
        enumerable: false,
        configurable: true
    });
    ProxySettingsData.prototype.getPassword = function () {
        return this._password;
    };
    Object.defineProperty(ProxySettingsData.prototype, "isHttpOnly", {
        get: function () {
            return this._isHttpOnly;
        },
        enumerable: false,
        configurable: true
    });
    ProxySettingsData.prototype.getIsHttpOnly = function () {
        return this._isHttpOnly;
    };
    Object.defineProperty(ProxySettingsData.prototype, "isDisabled", {
        get: function () {
            return this._isDisabled;
        },
        enumerable: false,
        configurable: true
    });
    ProxySettingsData.prototype.getIsDisabled = function () {
        return this._isDisabled;
    };
    return ProxySettingsData;
}());
exports["default"] = ProxySettingsData;
