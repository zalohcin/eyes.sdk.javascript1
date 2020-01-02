'use strict'

const {describe, it} = require('mocha')
const {expect} = require('chai')
const path = require('path')
const startTestCafe = require('../util/start-testcafe-in-mocha')

describe('Eyes TestCafe e2e', () => {
  const {runFileInTestCafe} = startTestCafe({beforeEach, afterEach})

  it('runs all e2e tests in folder "testcafe"', async () => {
    const failedCount = await runFileInTestCafe(path.resolve(__dirname, 'testcafe/*.testcafe.js'))
    expect(failedCount).to.equal(0)
  })
})
