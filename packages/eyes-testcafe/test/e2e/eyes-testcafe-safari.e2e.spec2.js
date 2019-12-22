'use strict'

const {describe, it} = require('mocha')
const {expect} = require('chai')
const path = require('path')
const startTestCafe = require('../setup/start-testcafe-in-mocha')

describe.only('Eyes TestCafe e2e Safari', () => {
  const browser = [
    ['browserstack:safari@13.0:OS X Catalina'],
    ['browserstack:safari@12.1:OS X Mojave'],
    ['browserstack:iPhone XS'],
    ['browserstack:iPhone 11 Pro Max'],
    ['browserstack:iPhone 11 Pro'],
    ['browserstack:iPhone 11'],
    ['browserstack:iPhone XS Max'],
    ['browserstack:iPhone XR'],
    ['browserstack:iPad Pro 12.9 2018'],
    ['browserstack:iPad Pro 11 2018'],
  ][2]
  const {runFileInTestCafe} = startTestCafe({beforeEach, afterEach, browser})

  it('runs all e2e Safari tests', async () => {
    const failedCount = await runFileInTestCafe(
      path.resolve(__dirname, 'testcafe/browsers/*.safari.testcafe.js'),
    )
    expect(failedCount).to.equal(0)
  })
})
