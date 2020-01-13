const tunnel = require('tunnel')

const {GeneralUtils, DateTimeUtils, TypeUtils} = require('@applitools/eyes-common')

const RETRY_REQUEST_INTERVAL = 500 // ms
const POLLING_DELAY_SEQUENCE = [500, 1000, 2000, 5000] // ms
const POLLING_DELAY_REPEAT_COUNT = 5

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

const configCustomOptions = config => {
  config._options = Object.assign(
    {withApiKey: true, retry: 1, delayBeforeRetry: false, isExternalRequest: false},
    config._options,
  )
  if (!config._options.isExternalRequest) {
    config._options.requestId = getRequestId()
  }
  return config
}
const configRequestProxy = (config, {proxy, logger}) => {
  if (!proxy.getIsHttpOnly()) {
    config.proxy = proxy.toProxyObject()
    logger.log('using proxy', config.proxy.host, config.proxy.port)
    return config
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
  config.httpsAgent = agent
  config.proxy = false // don't use the proxy, we use tunnel.

  logger.log('proxy is set as http only, using tunnel', proxyObject.host, proxyObject.port)
  return config
}
const configRequest = (config, {defaults, configuration, logger}) => {
  configCustomOptions(config)

  const options = config._options

  if (config.params === undefined) {
    config.params = {}
  }

  if (!options.isExternalRequest) {
    config = GeneralUtils.mergeDeep(defaults, config)

    if (!('apiKey' in config.params)) {
      if (options.withApiKey) {
        config.params.apiKey = configuration.getApiKey()
      }
    }
    if (!(CUSTOM_HEADER_NAMES.REQUEST_ID in config.headers)) {
      config.headers[CUSTOM_HEADER_NAMES.REQUEST_ID] = options.requestId || getRequestId()
    }
    if (options.isLongRequest) {
      config.headers[CUSTOM_HEADER_NAMES.EYES_EXPECT] = '202+location'
    }
    if (options.isLongRequest || options.isPollingRequest) {
      config.headers[CUSTOM_HEADER_NAMES.EYES_DATE] = DateTimeUtils.toRfc1123DateTime()
    }
  }

  if (!('removeSession' in config.params)) {
    const removeSession = configuration.getRemoveSession()
    if (TypeUtils.isNotNull(removeSession)) {
      config.params.removeSession = removeSession
    }
  }
  if (!('timeout' in config)) {
    const timeout = configuration.getConnectionTimeout()
    if (TypeUtils.isNotNull(timeout)) {
      config.timeout = timeout
    }
  }
  if (!('proxy' in config)) {
    const proxy = configuration.getProxy()
    if (TypeUtils.isNotNull(proxy)) {
      configRequestProxy(config, {proxy, logger})
    }
  }

  return config
}
const prepareRequest = async (config, {defaults, configuration, logger}) => {
  configRequest(config, {defaults, configuration, logger})

  const options = config._options

  logger.verbose(
    `ServerConnector.${options.name} [${options.requestId}] will now call to ${
      config.url
    } with params ${JSON.stringify(config.params)}`,
  )

  if (options.delay) {
    const delay = TypeUtils.isIterator(options.delay) ? options.delay.next().value : options.delay
    logger.verbose(`ServerConnector.${options.name} request delayed for ${delay} ms.`)
    await GeneralUtils.sleep(delay)
  }

  return config
}

const handleLongRequestResponse = async (response, {axios}) => {
  switch (response.status) {
    case HTTP_STATUS_CODES.OK: {
      return response
    }
    case HTTP_STATUS_CODES.ACCEPTED: {
      const config = {
        _options: {
          name: response.config._options.name,
          isPollingRequest: true,
          delay: response.config._options.pollingDelaySequence || getPollingDelaySequence(),
        },
        method: 'GET',
        url: response.headers.location,
      }
      return handleLongRequestResponse(await axios.request(config), {axios})
    }
    case HTTP_STATUS_CODES.CREATED: {
      const config = {
        _options: {
          name: response.config._options.name,
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
const handleRequestResponse = async (response, {axios, logger}) => {
  const options = response.config._options

  logger.verbose(
    `ServerConnector.${options.name} [${options.requestId}] - result ${response.statusText}, status code ${response.status}, url ${response.config.url}`,
  )

  if (options.isLongRequest) {
    return handleLongRequestResponse(response, {axios, logger})
  }

  if (options.isPollingRequest && response.status === HTTP_STATUS_CODES.OK) {
    options.repeat += 1
    return axios.request(response.config)
  }

  return response
}

const handleRequestError = async (err, {axios, logger}) => {
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

exports.configCustomOptions = configCustomOptions
exports.configRequest = configRequest
exports.prepareRequest = prepareRequest

exports.handleRequestResponse = handleRequestResponse

exports.handleRequestError = handleRequestError
