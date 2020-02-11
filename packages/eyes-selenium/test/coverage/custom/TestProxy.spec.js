'use strict'
const {getDriver, getEyes, getBatch} = require('./util/TestSetup')
const {Configuration, ProxySettings, ConsoleLogHandler} = require('../../../index')
const batch = getBatch()
describe('TestVGServerConfigs', () => {
  let webDriver, eyes

  beforeEach(async () => {
    webDriver = await getDriver('CHROME')
    ;({eyes} = await getEyes())
    eyes.setLogHandler(new ConsoleLogHandler(true))
  })

  afterEach(async () => {
    await webDriver.quit()
    eyes.abortIfNotClosed()
  })

  it(`TestVGSetProxy`, async () => {
    let conf = new Configuration()
    conf.setBatch(batch)
    conf.setProxy(new ProxySettings('http://127.0.0.1:5050'))
    conf.setAppName('app')
    conf.setTestName('test')
    eyes.setConfiguration(conf)

    await webDriver.get('https://google.com')
    await eyes.open(webDriver)
    await eyes.checkWindow()
    await eyes.close()
    // await expect(eyes.close()).to.be.rejectedWith(Error, 'IllegalState: Eyes not open')
  })
})
