'use strict'
const {describe, it} = require('mocha')
const {expect} = require('chai')
const makeGetUserAgents = require('../../../src/sdk/getUserAgents')

describe('getUserAgents', () => {
  it('caches result of doGetUserAgents', async () => {
    let counter = 0
    const doGetUserAgents = async () => ++counter
    const getUserAgents = makeGetUserAgents(doGetUserAgents)
    const result1 = await getUserAgents()
    const result2 = await getUserAgents()
    const result3 = await getUserAgents()
    expect(result1).to.equal(1)
    expect(result2).to.equal(1)
    expect(result3).to.equal(1)
  })
})
