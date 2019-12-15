'use strict'

const {describe, it, after, before} = require('mocha')
const {expect} = require('chai')
const path = require('path')
const startTestCafe = require('../setup/start-testcafe-in-mocha')
const startTestServer = require('../setup/start-test-server-in-mocha')

describe('Eyes TestCafe Integration', () => {
  const {runFileInTestCafe} = startTestCafe({beforeEach, afterEach})
  startTestServer({after, before, port: 5555})

  it('runs all integration tests in folder "testcafe"', async () => {
    const failedCount = await runFileInTestCafe(path.resolve(__dirname, 'testcafe/*.testcafe.js'))
    expect(failedCount).to.equal(0)
  })
})
