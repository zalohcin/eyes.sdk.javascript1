'use strict';

const ArgumentGuard = require('../ArgumentGuard');

/**
 * Encapsulates settings for sending Eyes communication via proxy.
 */
class ProxySettings {

    /**
     *
     * @param {String} uri The proxy's URI.
     * @param {String} [username] The username to be sent to the proxy.
     * @param {String} [password] The password to be sent to the proxy.
     */
    constructor(uri, username, password) {
        ArgumentGuard.notNull(uri, "uri");

        this._uri = uri;
        this._username = username;
        this._password = password;
    }

    getUri() {
        return this._uri;
    }

    getUsername() {
        return this._username;
    }

    getPassword() {
        return this._password;
    }

    toProxyString() {
        let protocol = 'http', uri = this._uri, auth = '';

        const i = this._uri.indexOf('://');
        if (i !== -1) {
            protocol = this._uri.slice(0, i);
            uri = this._uri.slice(i + 3);
        }

        if (this._username) {
            auth = `${this._username}:${this._password}@`;
        }

        return `${protocol}://${auth}${uri}`;
    }
}

module.exports = ProxySettings;
