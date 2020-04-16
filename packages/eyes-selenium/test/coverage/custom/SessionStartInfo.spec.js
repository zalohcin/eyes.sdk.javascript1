'use strict'

const path = require('path')
const assert = require('assert')
const fetch = require('node-fetch')
const fakeEyesServer = require('@applitools/sdk-fake-eyes-server')
const {fakeDriverServer} = require('../../util/fake-driver-server')
const {
  Eyes,
  VisualGridRunner,
  Logger,
  Target,
  ConsoleLogHandler,
  TestResultsStatus,
  AccessibilityLevel,
  AccessibilityVersion,
} = require('../../../index')
const {Builder} = require('selenium-webdriver')

const fixturesPath = path.resolve(__dirname, '../../fixtures')
const logger = new Logger(process.env.APPLITOOLS_SHOW_LOGS)

describe('SessionStartInfo', () => {
  let server, serverUrl, driver

  before(async () => {
    server = await fakeEyesServer({
      logger,
      expectedFolder: fixturesPath,
      updateFixtures: process.env.APPLITOOLS_UPDATE_FIXTURES,
    })
    serverUrl = `http://localhost:${server.port}`
    fakeDriverServer()
  })

  after(async () => {
    await server.close()
  })

  beforeEach(async () => {
    driver = await new Builder()
      .withCapabilities({
        browserName: 'chrome',
      })
      .usingServer('http://localhost:4444')
      .build()
  })

  it('sends correct data in startSession in classic mode', async () => {
    const eyes = setupEyes()
    configureEyes(eyes)

    await eyes.open(driver, 'SessionStartInfo', 'classic')
    await eyes.check('bla', Target.window())
    const testResults = await eyes.close(false)
    assert.strictEqual(testResults.getStatus(), TestResultsStatus.Passed) // sanity check

    const {startInfo} = await getSession(testResults)

    assert.strictEqual(startInfo.defaultMatchSettings.ignoreDisplacements, true)
    assert.deepStrictEqual(startInfo.defaultMatchSettings.accessibilitySettings, {
      level: 'AA',
      version: 'WCAG_2_0',
    })
  })

  it('sends correct data in startSession in visual grid mode', async () => {
    const eyes = setupEyes(new VisualGridRunner())
    configureEyes(eyes)

    await eyes.open(driver, 'SessionStartInfo', 'vg')
    await eyes.check('bla', Target.window())
    const testResults = await eyes.close(false)
    assert.strictEqual(testResults.getStatus(), TestResultsStatus.Passed) // sanity check

    const {startInfo} = await getSession(testResults)

    assert.strictEqual(startInfo.defaultMatchSettings.ignoreDisplacements, true)
    assert.deepStrictEqual(startInfo.defaultMatchSettings.accessibilitySettings, {
      level: 'AA',
      version: 'WCAG_2_0',
    })
  })

  function setupEyes(runner) {
    const eyes = new Eyes(runner)
    eyes.setServerUrl(serverUrl)
    eyes.setApiKey('fakeApiKey')
    if (process.env.APPLITOOLS_SHOW_LOGS) {
      eyes.setLogHandler(new ConsoleLogHandler(true))
    }
    eyes.setMatchTimeout(0)
    return eyes
  }

  function configureEyes(eyes) {
    const configuration = eyes.getConfiguration()
    configuration.setIgnoreDisplacements(true)
    configuration.setAccessibilityValidation({
      level: AccessibilityLevel.AA,
      version: AccessibilityVersion.WCAG_2_0,
    })
    eyes.setConfiguration(configuration)
  }

  async function getSession(testResults) {
    const sessionUrl = `${serverUrl}/api/sessions/batches/${encodeURIComponent(
      testResults.getBatchId(),
    )}/${encodeURIComponent(testResults.getId())}`
    const session = await fetch(sessionUrl).then(r => r.json())
    return session
  }
})
