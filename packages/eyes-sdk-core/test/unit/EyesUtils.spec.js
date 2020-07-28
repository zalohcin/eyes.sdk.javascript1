'use strict'

const assert = require('assert')
const {EyesUtils, Logger, Location} = require('../../index')
const EyesJsSnippets = require('../../lib/EyesJsSnippets')
const MockDriver = require('../utils/MockDriver')
const FakeWrappedDriver = require('../utils/FakeWrappedDriver')

describe('EyesUtils', function() {
  describe('getTranslateLocation', () => {
    it('translate(4px,5px)', async () => {
      const logger = new Logger(process.env.APPLITOOLS_SHOW_LOGS)
      const mockDriver = new MockDriver()
      mockDriver.mockScript(EyesJsSnippets.GET_TRANSFORMS, {
        transform: 'translate(4px,5px)',
        '-webkit-transform': 'translate(4px,5px)',
      })
      const driver = new FakeWrappedDriver(logger, mockDriver)
      const location = await EyesUtils.getTranslateLocation(logger, driver.executor)
      assert.deepStrictEqual(location, new Location({x: -4, y: -5}))
    })
    it('translate(4px)', async () => {
      const logger = new Logger(process.env.APPLITOOLS_SHOW_LOGS)
      const mockDriver = new MockDriver()
      mockDriver.mockScript(EyesJsSnippets.GET_TRANSFORMS, {
        transform: 'translate(4px)',
        '-webkit-transform': 'translate(4px)',
      })
      const driver = new FakeWrappedDriver(logger, mockDriver)
      const location = await EyesUtils.getTranslateLocation(logger, driver.executor)
      assert.deepStrictEqual(location, new Location({x: -4, y: -4}))
    })
  })
})
