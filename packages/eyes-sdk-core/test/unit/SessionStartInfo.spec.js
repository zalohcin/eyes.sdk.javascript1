'use strict'

const path = require('path')
const assert = require('assert')
const {startFakeEyesServer, getSession} = require('@applitools/sdk-fake-eyes-server')
const {Logger, ConsoleLogHandler, TestResultsStatus} = require('../../index')
const MockDriver = require('../utils/MockDriver')
const FakeEyesClassic = require('../utils/FakeEyesClassic')

const fixturesPath = path.resolve(__dirname, '../../fixtures')
const logger = new Logger(process.env.APPLITOOLS_SHOW_LOGS)

describe('SessionStartInfo', () => {
  let server, serverUrl, driver

  before(async () => {
    server = await startFakeEyesServer({
      logger,
      expectedFolder: fixturesPath,
      updateFixtures: process.env.APPLITOOLS_UPDATE_FIXTURES,
    })
    serverUrl = `http://localhost:${server.port}`
    driver = new MockDriver()
  })

  after(async () => {
    await server.close()
  })

  it('sends correct data in startSession in classic mode', async () => {
    const eyes = setupEyes()

    const configuration = eyes.getConfiguration()
    configuration.setIgnoreDisplacements(true)
    configuration.setAccessibilityValidation('AA')
    eyes.setConfiguration(configuration)

    await eyes.open(driver, 'SessionStartInfo', 'classic')
    await eyes.checkWindow('bla')
    const testResults = await eyes.close(false)
    assert.strictEqual(testResults.getStatus(), TestResultsStatus.Passed) // sanity check

    const {startInfo} = await getSession(testResults, serverUrl)

    assert.strictEqual(startInfo.defaultMatchSettings.ignoreDisplacements, true)
    assert.strictEqual(startInfo.defaultMatchSettings.accessibilityLevel, 'AA')
  })

  it('sends correct data in startSession in visual grid mode', async () => {})

  function setupEyes() {
    const eyes = new FakeEyesClassic()
    eyes.setServerUrl(serverUrl)
    eyes.setApiKey('fakeApiKey')
    if (process.env.APPLITOOLS_SHOW_LOGS) {
      eyes.setLogHandler(new ConsoleLogHandler(true))
    }
    eyes.setMatchTimeout(0)
    return eyes
  }
})
