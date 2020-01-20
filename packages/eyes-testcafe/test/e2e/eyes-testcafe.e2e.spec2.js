'use strict'

const {describe, it} = require('mocha')
const {expect} = require('chai')
const path = require('path')
const startTestCafe = require('../util/start-testcafe-in-mocha')
const startTestServer = require('../util/start-test-server-in-mocha')

describe('Eyes TestCafe e2e', () => {
  startTestServer({after, before, port: 5556})
  let runFileInTestCafe, close
  before(async () => {
    ;({runFileInTestCafe, close} = await startTestCafe())
  })

  after(async () => close())

  it('runs all e2e (chrome) tests in folder "testcafe"', async () => {
    const failedCount = await runFileInTestCafe(path.resolve(__dirname, 'testcafe/*.testcafe.js'))
    expect(failedCount).to.equal(0)
  })

  it('runs all e2e Safari tests', async () => {
    const browser = [
      ['saucelabs:Safari@latest:macOS 10.14'],
      ['browserstack:safari@13.0:OS X Catalina'],
      ['browserstack:safari@12.1:OS X Mojave'],
    ][1]
    const failedCount = await runFileInTestCafe(
      path.resolve(__dirname, 'testcafe/browsers/*.safari.testcafe.js'),
      browser,
    )
    expect(failedCount).to.equal(0)
  })

  it('runs all e2e Edge tests', async () => {
    const browser = [['saucelabs:MicrosoftEdge@latest:Windows 10'], ['browserstack:edge']][1]
    const failedCount = await runFileInTestCafe(
      path.resolve(__dirname, 'testcafe/browsers/*.edge.testcafe.js'),
      browser,
    )
    expect(failedCount).to.equal(0)
  })

  // IE snapshots are are always botttom (Testcafe bug)
  it.skip('runs all e2e IE tests', async () => {
    const browser = [['saucelabs:Internet Explorer@latest:Windows 10'], ['browserstack:ie']][1]
    const failedCount = await runFileInTestCafe(
      path.resolve(__dirname, 'testcafe/browsers/*.ie.testcafe.js'),
      browser,
    )
    expect(failedCount).to.equal(0)
  })
})
