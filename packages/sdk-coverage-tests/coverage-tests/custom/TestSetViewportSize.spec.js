'use strict'
const cwd = process.cwd()
const assert = require('assert')
const path = require('path')
const {Browsers} = require('../util/TestSetup')
const spec = require(path.resolve(cwd, 'src/SpecWrappedDriver'))
const {Eyes} = require(cwd)

describe('TestSetViewportSize', () => {
  let driver
  beforeEach(async () => {
    driver = await spec.build({capabilities: Browsers.chrome()})
  })
  afterEach(async () => {
    await spec.cleanup(driver)
  })

  it('static Eyes.setViewportSize', async () => {
    const expectedViewportSize = {width: 600, height: 600}
    await Eyes.setViewportSize(driver, expectedViewportSize)
    const actualViewportSize = await spec.executeScript(
      driver,
      'return {width: window.innerWidth, height: window.innerHeight}',
    )
    assert.deepStrictEqual(actualViewportSize, expectedViewportSize)
  })
})
