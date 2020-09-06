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

  it('TestSendDOM_Booking2', async function() {
    await driver.get(
      'https://booking.kayak.com/flights/TLV-MIA/2018-09-25/2018-10-31?sort=bestflight_a',
    )
    const actualDomJsonString = await captureDom(logger, driver, this.test.title)
    const actualDomJson = JSON.parse(actualDomJsonString)
    assert.ok(actualDomJson)
  })
})
