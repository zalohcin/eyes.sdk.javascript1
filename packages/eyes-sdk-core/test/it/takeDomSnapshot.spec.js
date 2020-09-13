const takeDomSnapshot = require('../../lib/utils/takeDomSnapshot')
const testServer = require('../../../sdk-shared/src/run-test-server')
const {join} = require('path')
const {expect} = require('chai')
const preProcessUrl = require('../../../sdk-shared/coverage-tests/util/adjust-url-to-docker')
const EyesDriver = require('../../lib/sdk/EyesDriver')
const FakeSpecDriver = require('../utils/FakeSpecDriver')
const MockDriver = require('../utils/MockDriver')
const Logger = require('../../lib/logging/Logger')

const MockEyesDriver = EyesDriver.specialize(FakeSpecDriver)
const logger = new Logger(!!process.env.APPLITOOLS_SHOW_LOGS)

describe('takeDomSnapshot', () => {
  let driver, eyesDriver, server1, server2
  before(async () => {
    server1 = await testServer({port: 7373, staticPath: join(__dirname, '../fixtures')})
    server2 = await testServer({port: 7374, staticPath: join(__dirname, '../fixtures')})

    driver = new MockDriver()

    // mock state
    // driver.mockElement
    // driver.mockElements
    // driver.mockScript

    eyesDriver = new MockEyesDriver(logger, driver)

    const url = preProcessUrl('http://localhost:7373/frames/frames_cors.html')
    await driver.get(url)
  })

  after(async () => {
    await driver.close()
    await server1.close()
    await server2.close()
  })

  it('should take a dom snapshot with frames', async () => {
    try {
      const snapshot = await takeDomSnapshot({driver: eyesDriver})
      expect(snapshot.frames.length).to.eql(1)
    } catch (error) {
      throw error
    }
  })
})
