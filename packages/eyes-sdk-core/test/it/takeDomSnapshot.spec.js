const takeDomSnapshot = require('../../lib/utils/takeDomSnapshot')
const testServer = require('../../../sdk-shared/src/run-test-server')
const {join} = require('path')
const {Builder, Capabilities, By} = require('selenium-webdriver')
const {expect} = require('chai')
const preProcessUrl = require('../../../sdk-shared/coverage-tests/util/adjust-url-to-docker')

describe('takeDomSnapshot', () => {
  let driver, eyesDriver, server1, server2
  before(async () => {
    server1 = await testServer({port: 7373, staticPath: join(__dirname, '../fixtures')})
    server2 = await testServer({port: 7374, staticPath: join(__dirname, '../fixtures')})
    driver = new Builder()
      .withCapabilities(Capabilities.chrome())
      .usingServer(process.env.CVG_TESTS_REMOTE)
      .build()

    eyesDriver = {
      execute: driver.executeScript.bind(driver),
      element: ({type, selector}) => driver.findElement(By[type](selector)),
      switchToChildContext: element => driver.switchTo().frame(element),
      switchToParentContext: () => driver.switchTo().parentFrame(),
    }
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
