'use strict'

const {Logger} = require('../../..')
const assert = require('assert')
const {captureDom, getExpectedDom, buildDriver} = require('./DomCapture_utils')

describe('DomCapture', function() {
  let driver,
    logger = new Logger(process.env.APPLITOOLS_SHOW_LOGS)
  beforeEach(async function() {
    driver = await buildDriver()
  })

  afterEach(async function() {
    await driver.quit()
  })

  it('TestSendDOM_1', async function() {
    await driver.get('http://applitools.github.io/demo/TestPages/DomTest/dom_capture.html')
    const actualDomJsonString = await captureDom(logger, driver, this.test.title)
    const actualDomJson = JSON.parse(actualDomJsonString)

    const expectedDomJson = await getExpectedDom(this.test.title)
    assert.deepStrictEqual(actualDomJson, expectedDomJson)
  })
})
