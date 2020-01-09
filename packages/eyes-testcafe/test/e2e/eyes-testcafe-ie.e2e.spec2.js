'use strict'

const {describe, it} = require('mocha')
const {expect} = require('chai')
const path = require('path')
const startTestCafe = require('../util/start-testcafe-in-mocha')

describe('Eyes TestCafe e2e IE', () => {
  const {runFileInTestCafe} = startTestCafe({beforeEach, afterEach, browser: ['browserstack:ie']})

  it('runs all e2e IE tests', async () => {
    const failedCount = await runFileInTestCafe(
      path.resolve(__dirname, 'testcafe/browsers/*.ie.testcafe.js'),
    )
    expect(failedCount).to.equal(0)
  })
})
