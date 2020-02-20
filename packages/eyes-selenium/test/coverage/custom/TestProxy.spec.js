'use strict'
const childProcess = require('child_process')
const {getDriver, getEyes, getBatch} = require('./util/TestSetup')
const {Configuration, ProxySettings, ConsoleLogHandler} = require('../../../index')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const expect = chai.expect
const batch = getBatch()
describe('TestVGServerConfigs', () => {
  let webDriver, eyes

  before(() => {
    startProxy()
  })

  after(() => {
    stopProxy()
  })

  beforeEach(async () => {
    webDriver = await getDriver('CHROME')
    ;({eyes} = await getEyes('VG'))
    eyes.setLogHandler(new ConsoleLogHandler(true))
  })

  afterEach(async () => {
    await eyes.abortIfNotClosed()
    await webDriver.quit()
  })

  it(`TestVGNetworkPassThroughProxy`, async () => {
    let conf = new Configuration()
    conf.setBatch(batch)
    conf.setProxy(new ProxySettings('http://127.0.0.1:8080', undefined, undefined, true))
    conf.setAppName('Eyes Selenium SDK - Test Proxy')
    conf.setTestName('proxy test')
    eyes.setConfiguration(conf)

    await eyes.open(webDriver)
    await webDriver.get('https://applitools.com/helloworld')
    await eyes.checkWindow()
    await eyes.close()
    await expect(eyes.close()).to.be.rejectedWith(Error, 'IllegalState: Eyes not open')
  })

  it(`TestVGNetworkFailThroughProxy`, async () => {
    let conf = new Configuration()
    conf.setBatch(batch)
    conf.setProxy(new ProxySettings('http://127.0.0.1:8081', undefined, undefined, true))
    conf.setAppName('Eyes Selenium SDK - Test Proxy')
    conf.setTestName('proxy test')
    eyes.setConfiguration(conf)
    await expect(eyes.open(webDriver)).to.be.rejectedWith(
      Error,
      'tunneling socket could not be established',
    )
  })
})

function startProxy() {
  childProcess.execSync(
    "docker run -d --name='tinyproxy' -p 8080:8888 dannydirect/tinyproxy:latest ANY",
  )
}
function stopProxy() {
  childProcess.execSync('docker stop tinyproxy')
  childProcess.execSync('docker rm tinyproxy')
}
