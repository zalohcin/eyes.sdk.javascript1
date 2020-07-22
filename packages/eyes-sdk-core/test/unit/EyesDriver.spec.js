const assert = require('assert')
const {Logger} = require('../../index')
const MockDriver = require('../utils/MockDriver')
const FakeDriver = require('../utils/FakeDriver')

describe('EyesDriver', () => {
  let driver

  before(async () => {
    const mock = new MockDriver()
    mock.mockElements([
      {selector: 'element0', rect: {x: 1, y: 2, width: 500, height: 501}},
      {selector: 'element1', rect: {x: 11, y: 12, width: 510, height: 501}},
    ])
    const logger = new Logger(false)
    driver = new FakeDriver(logger, mock)
    await driver.init()
  })

  it('constructor', async () => {
    assert.ok(driver.contexts.main)
    assert.ok(driver.contexts.current)
    assert.strictEqual(driver.contexts.current, driver.contexts.main)
  })

  describe('findElement', () => {
    it('main context', async () => {
      console.log(await driver.findElement('element1'))
    })
  })
})
