'use strict'

const assert = require('assert')

const {Configuration} = require('@applitools/eyes-common')
const {ServerConnector} = require('../../../lib/server/ServerConnector')

describe('ServerConnector', () => {
  it('_createHttpOptions works', () => {
    const configuratiion = new Configuration()
    const connector = new ServerConnector(console, configuratiion)
    const options = connector._createHttpOptions({
      method: 'POST',
      url: 'https://some.url/some/api',
      data: {},
    })

    delete options.params.apiKey
    assert.deepStrictEqual(options, {
      proxy: undefined,
      headers: {Accept: 'application/json', 'Content-Type': 'application/json'},
      timeout: 300000,
      responseType: 'json',
      params: {},
      method: 'POST',
      url: 'https://some.url/some/api',
      data: {},
      maxContentLength: 20971520,
    })
  })
})
