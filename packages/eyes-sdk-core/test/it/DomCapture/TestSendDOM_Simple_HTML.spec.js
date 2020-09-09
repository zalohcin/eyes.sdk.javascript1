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

  it('TestSendDOM_Simple_HTML', async function() {
    await driver.get('https://applitools-dom-capture-origin-1.surge.sh/test.html')
    const actualDomJsonString = await captureDom(logger, driver, this.test.title)
    const actualDomJson = JSON.parse(actualDomJsonString)

    const expectedDomJson = await getExpectedDom(this.test.title)
    assert.deepStrictEqual(actualDomJson, expectedDomJson)
  })
})
