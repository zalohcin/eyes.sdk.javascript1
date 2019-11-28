'use strict';

const assert = require('assert');

const { ProxySettings } = require('@applitools/eyes-common');
const {
  setProxyOptions,
} = require('../../../lib/server/setProxyOptions');

describe('ServerConnector', () => {
  it('setProxyOptions works with https proxy', () => {
    const proxy = new ProxySettings('https://some.url:2323', 'daniel', '1234');
    const options = {};
    setProxyOptions({ options, proxy, logger: { log: () => {} } });

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

  it('setProxyOptions works with http only proxy', () => {
    const proxy = new ProxySettings('http://some.url', 'daniel', '1234', true);
    const options = {};
    setProxyOptions({ options, proxy, logger: { log: () => {} } });

    assert.deepStrictEqual(options.proxy, false);
    assert.deepStrictEqual(options.httpsAgent.proxyOptions, {
      host: 'some.url',
      port: 8080,
      proxyAuth: 'daniel:1234',
    });
  });
});
