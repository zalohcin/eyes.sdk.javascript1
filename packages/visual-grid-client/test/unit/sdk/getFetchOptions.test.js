'use strict'

const {ProxySettings} = require('@applitools/eyes-sdk-core')
const getFetchOptions = require('../../../src/sdk/getFetchOptions')
const {expect} = require('chai')

describe('getFetchOptions', () => {
  it('adds user-agent and referer header', async () => {
    const url = 'https://some/url'
    const userAgent = 'bla'
    expect(
      getFetchOptions({
        url,
        userAgent,
      }),
    ).to.eql({
      headers: {Referer: url, 'User-Agent': userAgent},
    })
  })

  it("doesn't add user-agent header when fetching google fonts", async () => {
    const url = 'https://fonts.googleapis.com/css?family=Zilla+Slab'
    expect(
      getFetchOptions({
        url,
        userAgent: 'bla',
      }),
    ).to.eql({
      headers: {Referer: url},
    })
  })

  it('adds user-agent and referer header', async () => {
    const proxySettings = new ProxySettings('http://localhost:8888', 'user', 'pass', true)
    const url = 'https://some/url'
    const userAgent = 'bla'
    expect(
      getFetchOptions({
        url,
        userAgent,
        proxySettings,
      }).agent.constructor.name,
    ).to.equal('TunnelingAgent')
  })
})
