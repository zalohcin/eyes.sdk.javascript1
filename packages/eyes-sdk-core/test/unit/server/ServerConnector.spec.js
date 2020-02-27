'use strict'

const assert = require('assert')
const fakeEyesServer = require('@applitools/sdk-fake-eyes-server')
const {ServerConnector, Logger, Configuration, GeneralUtils} = require('../../../')
const {presult} = require('../../../lib/troubleshoot/utils')
const logger = new Logger(process.env.APPLITOOLS_SHOW_LOGS)

describe('ServerConnector', () => {
  it('sends startSession request', async () => {
    const {port, close} = await fakeEyesServer({logger})
    try {
      const serverUrl = `http://localhost:${port}`
      const configuration = new Configuration()
      configuration.setServerUrl(serverUrl)
      const serverConnector = new ServerConnector(logger, configuration)
      const appIdOrName = 'ServerConnector unit test'
      const scenarioIdOrName = "doesn't throw exception on server failure"
      const batchId = String(Date.now())
      const runningSession = await serverConnector.startSession({
        appIdOrName,
        scenarioIdOrName,
        environment: {},
        batchInfo: {
          id: batchId,
        },
      })
      const sessionId = `${appIdOrName}__${scenarioIdOrName}`
      assert.deepStrictEqual(runningSession.toJSON(), {
        baselineId: `${sessionId}__baseline`,
        batchId,
        id: `${sessionId}__running`,
        isNewSession: false,
        renderingInfo: undefined,
        sessionId,
        url: `${sessionId}__url`,
      })
    } finally {
      await close()
    }
  })

  // [trello] https://trello.com/c/qjmAw1Sc/160-storybook-receiving-an-inconsistent-typeerror
  it("doesn't throw exception on server failure", async () => {
    const {port, close} = await fakeEyesServer({logger, hangUp: true})
    try {
      const serverUrl = `http://localhost:${port}`
      const configuration = new Configuration()
      configuration.setServerUrl(serverUrl)
      const serverConnector = new ServerConnector(logger, configuration)
      const [err] = await presult(serverConnector.startSession({}))
      assert.deepStrictEqual(err, new Error('socket hang up'))
    } finally {
      await close()
    }
  })

  it('getUserAgents works', async () => {
    const {port, close} = await fakeEyesServer({logger})
    try {
      const serverUrl = `http://localhost:${port}`
      const configuration = new Configuration()
      configuration.setServerUrl(serverUrl)
      const serverConnector = new ServerConnector(logger, configuration)
      await serverConnector.renderInfo()
      const userAgents = await serverConnector.getUserAgents()
      assert.deepStrictEqual(userAgents, {
        chrome: 'chrome-ua',
        'chrome-1': 'chrome-1-ua',
        'chrome-2': 'chrome-2-ua',
        firefox: 'firefox-ua',
        'firefox-1': 'firefox-1-ua',
        'firefox-2': 'firefox-2-ua',
        safari: 'safari-ua',
        'safari-2': 'safari-2-ua',
        'safari-1': 'safari-1-ua',
        edge: 'edge-ua',
        ie: 'ie-ua',
        ie10: 'ie10-ua',
      })
    } finally {
      await close()
    }
  })

  it('uploadScreenshot uploads to resultsUrl webhook', async () => {
    const configuration = new Configuration()
    const serverConnector = new ServerConnector(logger, configuration)
    const renderingInfo = await serverConnector.renderInfo()
    const id = GeneralUtils.guid()
    const buffer = Buffer.from('something')
    const result = await serverConnector.uploadScreenshot(id, buffer)
    assert.strictEqual(result, renderingInfo.getResultsUrl().replace('__random__', id))
  })

  it('postDomSnapshot uploads to resultsUrl webhook', async () => {
    const configuration = new Configuration()
    const serverConnector = new ServerConnector(logger, configuration)
    const renderingInfo = await serverConnector.renderInfo()
    const buffer = Buffer.from('something')
    const id = GeneralUtils.guid()
    const result = await serverConnector.postDomSnapshot(id, buffer)
    assert.strictEqual(result, renderingInfo.getResultsUrl().replace('__random__', id))
  })

  it('long request waits right amount of time', async () => {
    const configuration = new Configuration()
    const serverConnector = new ServerConnector(logger, configuration)
    const ANSWER_AFTER = 8 // requests
    const timeouts = []
    let timestampBefore
    serverConnector._axios.defaults.adapter = async config => {
      const response = {status: 200, config, data: {}, headers: {}, request: {}}
      if (config.isLongRequest) {
        response.status = 202
        timestampBefore = Date.now()
      } else if (config.isPollingRequest) {
        const timestampAfter = Date.now()
        timeouts.push(timestampAfter - timestampBefore)
        timestampBefore = timestampAfter
        response.status = config.repeat < ANSWER_AFTER - 1 ? 200 : 201
      }
      return response
    }
    const delayBeforePolling = [].concat(Array(3).fill(100), Array(3).fill(200), 500)
    await serverConnector._axios.request({
      isLongRequest: true,
      delayBeforePolling,
    })
    assert.strictEqual(timeouts.length, ANSWER_AFTER)
    timeouts.forEach((timeout, index) => {
      const expectedTimeout = delayBeforePolling[Math.min(index, delayBeforePolling.length - 1)]
      assert(timeout >= expectedTimeout && timeout <= expectedTimeout + 10)
    })
  })
})
