'use strict'

const {Logger} = require('../../..')
const assert = require('assert')
const {captureDom, buildDriver} = require('./DomCapture_utils')

describe('DomCapture', function() {
  let driver,
    logger = new Logger(process.env.APPLITOOLS_SHOW_LOGS)
  beforeEach(async function() {
    driver = await buildDriver()
  })

  afterEach(async function() {
    await driver.quit()
  })

  it('TestSendDOM_nytimes', async function() {
    await driver.get('https://cooking.nytimes.com/')
    const actualDomJsonString = await captureDom(logger, driver, this.test.title)
    const actualDomJson = JSON.parse(actualDomJsonString)
    assert.ok(actualDomJson)
  })
})
