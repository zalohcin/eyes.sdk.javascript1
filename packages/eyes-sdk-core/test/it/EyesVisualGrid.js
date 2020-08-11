const {expect} = require('chai')
const {startFakeEyesServer, getSession} = require('@applitools/sdk-fake-eyes-server')
const MockDriver = require('../utils/MockDriver')
const {EyesVisualGrid} = require('../utils/FakeSDK')
const {MatchLevel} = require('../../index')

describe('EyesVisualGrid', async () => {
  let server, serverUrl, driver, eyes

  before(async () => {
    driver = new MockDriver()
    eyes = new EyesVisualGrid()
    server = await startFakeEyesServer({logger: eyes._logger, matchMode: 'always'})
    serverUrl = `http://localhost:${server.port}`
    eyes.setServerUrl(serverUrl)
  })

  after(async () => {
    await server.close()
  })

  it('should use default match level', async () => {
    await eyes.open(driver, 'FakeApp', 'FakeTest')
    await eyes.check()
    const results = await eyes.close()
    const {matchLevel} = await extractMatchSettings(results)
    expect(matchLevel).to.be.eql('Strict')
  })

  it('should use specified match level', async () => {
    await eyes.open(driver, 'FakeApp', 'FakeTest')
    await eyes.check({matchLevel: MatchLevel.Layout})
    const results = await eyes.close()
    const {matchLevel} = await extractMatchSettings(results)
    expect(matchLevel).to.be.eql('Layout')
  })

  async function extractMatchSettings(results) {
    const session = await getSession(results, serverUrl)
    const imageMatchSettings = session.steps[0].matchWindowData.options.imageMatchSettings
    return imageMatchSettings
  }
})
