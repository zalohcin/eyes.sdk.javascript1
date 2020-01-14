'use strict'

const assert = require('assert')
const {ServerConnector, Logger, Configuration, GeneralUtils} = require('../../../')
const {presult} = require('../../../lib/troubleshoot/utils')
const logger = new Logger(process.env.APPLITOOLS_SHOW_LOGS)
const fakeEyesServer = require('@applitools/sdk-fake-eyes-server')

const {configRequest} = require('../../../lib/server/requestHelpers')

describe('ServerConnector', () => {
  it('configRequest works', () => {
    const configuration = new Configuration()
    const connector = new ServerConnector(logger, configuration)
    const config = configRequest(
      {
        _options: {
          withApiKey: false,
        },
        method: 'POST',
        url: 'https://some.url/some/api',
        data: {},
      },
      {
        defaults: connector._defaultRequestConfig,
        configuration: connector._configuration,
        logger: connector._logger,
      },
    )

    delete config._options.requestId
    delete config.headers['x-applitools-eyes-client-request-id']

    assert.deepStrictEqual(config, {
      _options: {
        delayBeforeRetry: false,
        isExternalRequest: false,
        retry: 1,
        withApiKey: false,
      },
      proxy: undefined,
      headers: {Accept: 'application/json', 'Content-Type': 'application/json'},
      timeout: 300000,
      responseType: 'json',
      params: {},
      method: 'POST',
      url: 'https://some.url/some/api',
      data: {},
      maxContentLength: 20971520,
    })
  })

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

  it('uploadScreenshot works', async () => {
    const configuration = new Configuration()
    const serverConnector = new ServerConnector(logger, configuration)
    const renderingInfo = await serverConnector.renderInfo()
    const id = GeneralUtils.guid()
    const buffer = Buffer.from('something')
    const result = await serverConnector.uploadScreenshot(id, buffer)
    assert.strictEqual(result, renderingInfo.getResultsUrl().replace('__random__', id))
  })

  it('long request waits right amount of time', async () => {
    const configuration = new Configuration()
    const serverConnector = new ServerConnector(logger, configuration)
    const POLLING_DELAY_SEQUENCE = [100, 200, 400, 1000]
    const POLLING_DELAY_REPEAT_COUNT = 3
    const ANSWER_IN = 10 // requests
    let counter = 0
    let timestampBefore
    const timeouts = []
    const getPollingDelaySequence = () => {
      let repeat = 0
      return {
        next() {
          return {
            value:
              POLLING_DELAY_SEQUENCE[
                Math.min(
                  Math.floor(repeat++ / POLLING_DELAY_REPEAT_COUNT),
                  POLLING_DELAY_SEQUENCE.length - 1,
                )
              ],
            done: false,
          }
        },
      }
    }
    serverConnector._axios.defaults.adapter = async config => {
      let status = 200
      if (config._options.isLongRequest) {
        status = 202
        timestampBefore = Date.now()
      } else if (config._options.isPollingRequest) {
        const timestampAfter = Date.now()
        timeouts.push(timestampAfter - timestampBefore)
        timestampBefore = timestampAfter
        status = ++counter < ANSWER_IN ? 200 : 201
      }
      return {
        data: {},
        status,
        statusText: 'ok',
        headers: {},
        config: config,
        request: {},
      }
    }
    await serverConnector._axios.request({
      _options: {
        isLongRequest: true,
        pollingDelaySequence: getPollingDelaySequence(),
      },
      url: 'http://fakehost.com',
    })
    assert.strictEqual(timeouts.length, ANSWER_IN)
    const expectedSequence = getPollingDelaySequence()
    timeouts.forEach(timeout => {
      const expectedTimeout = expectedSequence.next().value
      assert(timeout >= expectedTimeout && timeout <= expectedTimeout + 15)
    })
  })
})
