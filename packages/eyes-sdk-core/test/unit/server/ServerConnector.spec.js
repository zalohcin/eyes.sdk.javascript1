'use strict';

const assert = require('assert');

const { Configuration, ProxySettings } = require('@applitools/eyes-common');
const {
  ServerConnector,
} = require('../../../lib/server/ServerConnector');

describe('ServerConnector', () => {
  it('_createHttpOptions works', () => {
    const configuratiion = new Configuration();
    const connector = new ServerConnector(console, configuratiion);
    const options = connector._createHttpOptions({
      method: 'POST',
      url: 'https://some.url/some/api',
      data: {},
    });

    delete options.params.apiKey;
    assert.deepStrictEqual(options, {
      proxy: undefined,
      headers:
       { Accept: 'application/json',
         'Content-Type': 'application/json' },
      timeout: 300000,
      responseType: 'json',
      params: {},
      method: 'POST',
      url: 'https://some.url/some/api',
      data: {},
      maxContentLength: 20971520 });
  });

  it('_setProxyOptions works with https proxy', () => {
    const proxySettings = new ProxySettings('https://some.url:2323', 'daniel', '1234');
    const { _setProxyOptions: setProxyOptions } = ServerConnector;
    const options = {};
    setProxyOptions(options, proxySettings);

    assert.deepStrictEqual(options, {
      proxy: {
        auth: {
          password: '1234',
          username: 'daniel',
        },
        host: 'some.url',
        isHttpOnly: false,
        port: '2323',
        protocol: 'https:',
      },
    });
  });

  it('_setProxyOptions works with http only proxy', () => {
    const proxySettings = new ProxySettings('http://some.url', 'daniel', '1234', true);
    const { _setProxyOptions: setProxyOptions } = ServerConnector;
    const options = {};
    setProxyOptions(options, proxySettings);

    assert.deepStrictEqual(options.proxy, false);
    assert.deepStrictEqual(options.httpsAgent.proxyOptions, {
      host: 'some.url',
      port: 8080,
      proxyAuth: 'daniel:1234',
    });
  });
});
