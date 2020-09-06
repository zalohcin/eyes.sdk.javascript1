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

  it('TestSendDOM_Booking1', async function() {
    await driver.get(
      'https://www.booking.com/searchresults.en-gb.html?label=gen173nr-1FCAEoggJCAlhYSDNYBGhqiAEBmAEuwgEKd2luZG93cyAxMMgBDNgBAegBAfgBC5ICAXmoAgM;sid=ce4701a88873eed9fbb22893b9c6eae4;city=-2600941;from_idr=1&;ilp=1;d_dcp=1',
    )
    const actualDomJsonString = await captureDom(logger, driver, this.test.title)
    const actualDomJson = JSON.parse(actualDomJsonString)
    assert.ok(actualDomJson)
  })
})
