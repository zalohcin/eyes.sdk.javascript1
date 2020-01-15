'use strict'

const assert = require('assert')
const {ProxySettings, Logger, Configuration} = require('@applitools/eyes-common')
const {configRequest, configRequestProxy} = require('../../../lib/server/requestHelpers')
const logger = new Logger(process.env.APPLITOOLS_SHOW_LOGS)

describe('requestHelpers', () => {
  it('configRequest works', () => {
    const APPLITOOLS_API_KEY = process.env.APPLITOOLS_API_KEY || 'ApiKey'
    const REQUEST_ID = 'RequestId'
    const configuration = new Configuration()
    configuration.setApiKey(APPLITOOLS_API_KEY)
    configuration.setProxy({
      url: 'http://some.proxy.url:3000',
      username: 'username',
      password: 'password',
    })
    const config = configRequest({
      axiosConfig: {
        _options: {
          withApiKey: true,
          requestId: REQUEST_ID,
        },
        method: 'POST',
        url: 'https://some.url/some/api',
        data: {},
      },
      configuration: configuration,
      logger,
    })

    assert.deepStrictEqual(config, {
      _options: {
        requestId: REQUEST_ID,
        withApiKey: true,
      },
      method: 'POST',
      url: 'https://some.url/some/api',
      headers: {
        ['x-applitools-eyes-client-request-id']: REQUEST_ID,
      },
      params: {
        apiKey: APPLITOOLS_API_KEY,
      },
      data: {},
      proxy: {
        auth: {
          username: 'username',
          password: 'password',
        },
        protocol: 'http:',
        host: 'some.proxy.url',
        port: '3000',
        isHttpOnly: false,
      },
    })
  })

  it('configRequestProxy works with https proxy', () => {
    const proxy = new ProxySettings('https://some.url:2323', 'daniel', '1234')
    const config = configRequestProxy({axiosConfig: {}, proxy, logger})

    assert.deepStrictEqual(config, {
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
    })
  })

  it('configRequestProxy works with http only proxy', () => {
    const proxy = new ProxySettings('http://some.url', 'daniel', '1234', true)
    const config = configRequestProxy({axiosConfig: {}, proxy, logger})

    assert.deepStrictEqual(config.proxy, false)
    assert.deepStrictEqual(config.httpsAgent.proxyOptions, {
      host: 'some.url',
      port: 8080,
      proxyAuth: 'daniel:1234',
    })
  })
})
