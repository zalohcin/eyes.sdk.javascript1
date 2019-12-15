'use strict'

const {describe, it} = require('mocha')
const {expect} = require('chai')
const path = require('path')
const startTestCafe = require('../setup/start-testcafe-in-mocha')

describe.skip('Eyes TestCafe e2e edge', () => {
  const {runFileInTestCafe} = startTestCafe({beforeEach, afterEach, browser: 'browserstack:edge'})

  it('runs all e2e edge tests in folder "testcafe/ie"', async () => {
    const failedCount = await runFileInTestCafe(
      path.resolve(__dirname, 'testcafe/ie/*.edge.testcafe.js'),
    )
    expect(failedCount).to.equal(0)
  })
})
