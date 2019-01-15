'use strict';

const { URL } = require('url');

const { ArgumentGuard } = require('@applitools/eyes-common');

/**
 * Encapsulates settings for sending Eyes communication via proxy.
 */
class ProxySettings {
  /**
   *
   * @param {string} uri The proxy's URI.
   * @param {string} [username] The username to be sent to the proxy.
   * @param {string} [password] The password to be sent to the proxy.
   */
  constructor(uri, username, password) {
    ArgumentGuard.notNull(uri, 'uri');

    this._uri = uri;
    this._username = username;
    this._password = password;

    this._url = new URL(uri.includes('://') ? uri : `http://${uri}`);
  }

  // noinspection JSUnusedGlobalSymbols
  getUri() {
    return this._uri;
  }

  // noinspection JSUnusedGlobalSymbols
  getUsername() {
    return this._username;
  }

  // noinspection JSUnusedGlobalSymbols
  getPassword() {
    return this._password;
  }

  // noinspection FunctionWithMoreThanThreeNegationsJS
  /**
   * @return {{protocol: string, host: string, port: number, auth: {username: string, password: string}}}
   */
  toProxyObject() {
    const proxy = {};

    proxy.protocol = this._url.protocol;
    proxy.host = this._url.hostname;
    proxy.port = this._url.port;

    if (!this._username && this._url.username) {
      proxy.auth = {
        username: this._url.username,
        password: this._url.password,
      };
    } else if (this._username) {
      proxy.auth = {
        username: this._username,
        password: this._password,
      };
    }

    return proxy;
  }
}

exports.ProxySettings = ProxySettings;
