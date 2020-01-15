const tunnel = require('tunnel')

const {GeneralUtils, DateTimeUtils, TypeUtils} = require('@applitools/eyes-common')

const RETRY_REQUEST_INTERVAL = 500 // 0.5s
const POLLING_DELAY_SEQUENCE = [].concat(
  Array(5).fill(500), // 5 tries with delay 0.5s
  Array(5).fill(1000), // 5 tries with delay 1s
  Array(5).fill(2000), // 5 tries with delay 2s
  5000, // all next tries with delay 5s
)

const HTTP_STATUS_CODES = {
  CREATED: 201,
  ACCEPTED: 202,
  OK: 200,
  GONE: 410,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  GATEWAY_TIMEOUT: 504,
}

const HTTP_FAILED_CODES = [
  HTTP_STATUS_CODES.NOT_FOUND,
  HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
  HTTP_STATUS_CODES.BAD_GATEWAY,
  HTTP_STATUS_CODES.GATEWAY_TIMEOUT,
]

const REQUEST_FAILED_CODES = ['ECONNRESET', 'ECONNABORTED', 'ETIMEDOUT', 'ENOTFOUND', 'EAI_AGAIN']

const CUSTOM_HEADER_NAMES = {
  REQUEST_ID: 'x-applitools-eyes-client-request-id',
  EYES_EXPECT: 'Eyes-Expect',
  EYES_DATE: 'Eyes-Date',
}

let counter = 0
const REQUEST_GUID = GeneralUtils.guid()
const getRequestId = () => `${++counter}--${REQUEST_GUID}`

function configRequestProxy({axiosConfig, proxy, logger}) {
  if (!proxy.getIsHttpOnly()) {
    axiosConfig.proxy = proxy.toProxyObject()
    logger.log('using proxy', axiosConfig.proxy.host, axiosConfig.proxy.port)
    return axiosConfig
  }

  if (tunnel.httpsOverHttp === undefined) {
    throw new Error('http only proxy is not supported in the browser')
  }

  const proxyObject = proxy.toProxyObject()
  const proxyAuth =
    proxyObject.auth && proxyObject.auth.username
      ? `${proxyObject.auth.username}:${proxyObject.auth.password}`
      : undefined
  const agent = tunnel.httpsOverHttp({
    proxy: {
      host: proxyObject.host,
      port: proxyObject.port || 8080,
      proxyAuth,
    },
  })
  axiosConfig.httpsAgent = agent
  axiosConfig.proxy = false // don't use the proxy, we use tunnel.

  logger.log('proxy is set as http only, using tunnel', proxyObject.host, proxyObject.port)
  return axiosConfig
}
function configRequest({axiosConfig, configuration, logger}) {
  const options = axiosConfig._options

  if (axiosConfig.params === undefined) {
    axiosConfig.params = {}
  }
  if (!('apiKey' in axiosConfig.params)) {
    if (options.withApiKey) {
      axiosConfig.params.apiKey = configuration.getApiKey()
    }
  }
  if (!('removeSession' in axiosConfig.params)) {
    const removeSession = configuration.getRemoveSession()
    if (TypeUtils.isNotNull(removeSession)) {
      axiosConfig.params.removeSession = removeSession
    }
  }

  if (axiosConfig.headers === undefined) {
    axiosConfig.headers = {}
  }
  if (!(CUSTOM_HEADER_NAMES.REQUEST_ID in axiosConfig.headers)) {
    options.requestId = options.requestId || getRequestId()
    axiosConfig.headers[CUSTOM_HEADER_NAMES.REQUEST_ID] = options.requestId
  }
  if (options.isLongRequest) {
    axiosConfig.headers[CUSTOM_HEADER_NAMES.EYES_EXPECT] = '202+location'
  }
  if (options.isLongRequest || options.isPollingRequest) {
    axiosConfig.headers[CUSTOM_HEADER_NAMES.EYES_DATE] = DateTimeUtils.toRfc1123DateTime()
  }

  if (!('timeout' in axiosConfig)) {
    const timeout = configuration.getConnectionTimeout()
    if (TypeUtils.isNotNull(timeout)) {
      axiosConfig.timeout = timeout
    }
  }
  if (!('proxy' in axiosConfig)) {
    const proxy = configuration.getProxy()
    if (TypeUtils.isNotNull(proxy)) {
      configRequestProxy({axiosConfig, proxy, logger})
    }
  }

  return axiosConfig
}

async function prepareRequest({axiosConfig, configuration, logger}) {
  const config = configRequest({axiosConfig, configuration, logger})

  const options = config._options

  logger.verbose(
    `ServerConnector.${options.name} [${options.requestId}] will now call to ${
      config.url
    } with params ${JSON.stringify(config.params)}`,
  )

  if (options.delay) {
    const delay = TypeUtils.isArray(options.delay)
      ? options.delay[Math.min(options.repeat, options.delay.length - 1)]
      : options.delay
    logger.verbose(`ServerConnector.${options.name} request delayed for ${delay} ms.`)
    await GeneralUtils.sleep(delay)
  }

  return config
}

async function handleLongRequestResponse({response, axios}) {
  switch (response.status) {
    case HTTP_STATUS_CODES.OK: {
      return response
    }
    case HTTP_STATUS_CODES.ACCEPTED: {
      const options = response.config._options
      const config = {
        _options: {
          name: options.name,
          isPollingRequest: true,
          delay: options.pollingDelaySequence || POLLING_DELAY_SEQUENCE,
        },
        method: 'GET',
        url: response.headers.location,
      }
      return handleLongRequestResponse({
        response: await axios.request(config),
        axios,
      })
    }
    case HTTP_STATUS_CODES.CREATED: {
      const options = response.config._options
      const config = {
        _options: {
          name: options.name,
        },
        method: 'DELETE',
        url: response.headers.location,
        headers: {
          [CUSTOM_HEADER_NAMES.EYES_DATE]: DateTimeUtils.toRfc1123DateTime(),
        },
      }
      return axios.request(config)
    }
    case HTTP_STATUS_CODES.GONE: {
      throw new Error('The server task has gone.')
    }
    default: {
      throw new Error(`Unknown error during long request: ${JSON.stringify(response)}`)
    }
  }
}
async function handleRequestResponse({response, axios, logger}) {
  const options = response.config._options

  logger.verbose(
    `ServerConnector.${options.name} [${options.requestId}] - result ${response.statusText}, status code ${response.status}, url ${response.config.url}`,
  )

  if (options.isLongRequest) {
    return handleLongRequestResponse({response, axios, logger})
  }

  if (options.isPollingRequest && response.status === HTTP_STATUS_CODES.OK) {
    options.repeat += 1
    return axios.request(response.config)
  }

  return response
}

async function handleRequestError({err, axios, logger}) {
  const reason = `${err.message}${err.response ? `(${err.response.statusText})` : ''}`
  const config = err.config
  const options = config._options

  logger.log(
    `ServerConnector.${options.name} [${options.requestId}] - ${
      config.method
    } request failed. reason=${reason} | url=${config.url} ${
      err.response ? `| status=${err.response.status} ` : ''
    }| params=${JSON.stringify(config.params).slice(0, 100)}`,
  )

  if (err.response && err.response.data) {
    logger.verbose(`ServerConnector.${options.name} - failure body:\n${err.response.data}`)
  }

  if (
    options.retry > 0 &&
    ((err.response && HTTP_FAILED_CODES.includes(err.response.status)) ||
      REQUEST_FAILED_CODES.includes(err.code))
  ) {
    logger.verbose(`ServerConnector retrying request with delay ${options.delayBeforeRetry}...`)

    if (options.delayBeforeRetry) {
      options.delay = RETRY_REQUEST_INTERVAL
    }
    options.retry -= 1
    return axios.request(config)
  }
  throw new Error(reason)
}

exports.configRequestProxy = configRequestProxy
exports.configRequest = configRequest
exports.prepareRequest = prepareRequest

exports.handleRequestResponse = handleRequestResponse

exports.handleRequestError = handleRequestError
