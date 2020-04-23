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
  AccessibilityGuidelinesVersion,
  Configuration,
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

  describe('AccessibilityValidation', () => {
    const configuration = new Configuration({
      defaultMatchSettings: {
        accessibilitySettings: {
          level: AccessibilityLevel.AA,
          version: AccessibilityGuidelinesVersion.WCAG_2_0,
        },
      },
    })

    it('TestAccessibiltyValidation', async () => {
      await runTest()
    })

    it('TestAccessibiltyValidation_VG', async () => {
      await runTest(new VisualGridRunner())
    })

    async function runTest(runner) {
      const eyes = setupEyes({runner, configuration})

      await eyes.open(driver, 'SessionStartInfo', 'classic')
      await eyes.check('bla', Target.window())
      const testResults = await eyes.close(false)
      assert.strictEqual(testResults.getStatus(), TestResultsStatus.Passed) // sanity check

      const {startInfo} = await getSession(testResults)

      assert.deepStrictEqual(startInfo.defaultMatchSettings.accessibilitySettings, {
        level: 'AA',
        version: 'WCAG_2_0',
      })

      // reset value
      eyes.setConfiguration(eyes.getConfiguration().setAccessibilityValidation())

      await eyes.open(driver, 'SessionStartInfo', 'classic')
      await eyes.check('bla', Target.window())
      const testResultsWithoutAccessibility = await eyes.close(false)
      assert.strictEqual(testResultsWithoutAccessibility.getStatus(), TestResultsStatus.Passed) // sanity check

      const {startInfo: startInfoWithoutAccessibility} = await getSession(
        testResultsWithoutAccessibility,
      )

      assert.strictEqual(
        startInfoWithoutAccessibility.defaultMatchSettings.accessibilitySettings,
        undefined,
      )
    }
  })

  function setupEyes({runner, configuration} = {}) {
    const eyes = new Eyes(runner)
    configuration.setServerUrl(serverUrl)
    configuration.setApiKey('fakeApiKey')
    if (process.env.APPLITOOLS_SHOW_LOGS) {
      eyes.setLogHandler(new ConsoleLogHandler(true))
    }
    configuration.setMatchTimeout(0)
    eyes.setConfiguration(configuration)
    return eyes
  }

  async function getSession(testResults) {
    const sessionUrl = `${serverUrl}/api/sessions/batches/${encodeURIComponent(
      testResults.getBatchId(),
    )}/${encodeURIComponent(testResults.getId())}`
    const session = await fetch(sessionUrl).then(r => r.json())
    return session
  }
})
