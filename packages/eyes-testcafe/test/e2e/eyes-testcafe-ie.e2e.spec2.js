'use strict'

const {describe, it} = require('mocha')
const {expect} = require('chai')
const path = require('path')
const startTestCafe = require('../setup/start-testcafe-in-mocha')

describe.skip('Eyes TestCafe e2e IE', () => {
  const {runFileInTestCafe} = startTestCafe({beforeEach, afterEach, browser: 'browserstack:ie'})

  it('runs all e2e IE tests in folder "testcafe/ie"', async () => {
    const failedCount = await runFileInTestCafe(
      path.resolve(__dirname, 'testcafe/ie/*.ie.testcafe.js'),
    )
    expect(failedCount).to.equal(0)
  })
})
