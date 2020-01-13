'use strict'

const {GeneralUtils, DateTimeUtils} = require('@applitools/eyes-common')

const RETRY_REQUEST_INTERVAL = 500 // ms
const LONG_REQUEST_DELAY_SEQUENCE = [500, 1000, 2000, 5000] // ms
const LONG_REQUEST_DELAY_REPEAT_COUNT = 5

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

let counter = 0
const REQUEST_GUID = GeneralUtils.guid()
const getRequestId = () => `${++counter}--${REQUEST_GUID}`

/**
 * @typedef {{data: *, status: number, statusText: string, headers: *, request: *}} AxiosResponse
 */

/**
 * @private
 * @param {ServerConnector} self
 * @param {string} name
 * @param {object} options
 * @param {number} [retry=1]
 * @param {boolean} [delayBeforeRetry=false]
 * @return {Promise<AxiosResponse>}
 */
async function sendRequest(self, name, options, retry = 1, delayBeforeRetry = false) {
  if (options.data instanceof Buffer && options.data.length === 0) {
    // This 'if' fixes a bug in Axios whereby Axios doesn't send a content-length when the buffer is of length 0.
    // This behavior makes the rendering-grid's nginx get stuck as it doesn't know when the body ends.
    // https://github.com/axios/axios/issues/1701
    options.data = ''
  }

  counter += 1
  const requestId = `${counter}--${REQUEST_GUID}`
  options.headers['x-applitools-eyes-client-request-id'] = requestId

  // eslint-disable-next-line max-len
  self._logger.verbose(
    `ServerConnector.${name} [${requestId}] will now call to ${
      options.url
    } with params ${JSON.stringify(options.params)}`,
  )

  try {
    const response = await axios(options)

    // eslint-disable-next-line max-len
    self._logger.verbose(
      `ServerConnector.${name} [${requestId}] - result ${response.statusText}, status code ${response.status}, url ${options.url}`,
    )
    return response
  } catch (err) {
    console.log(err)
    const reasonMsg = `${err.message}${err.response ? `(${err.response.statusText})` : ''}`

    self._logger.log(
      `ServerConnector.${name} [${requestId}] - ${
        options.method
      } request failed. reason=${reasonMsg} | url=${options.url} ${
        err.response ? `| status=${err.response.status} ` : ''
      }| params=${JSON.stringify(options.params).slice(0, 100)}`,
    )

    if (err.response && err.response.data) {
      self._logger.verbose(`ServerConnector.${name} - failure body:\n${err.response.data}`)
    }

    if (
      retry > 0 &&
      ((err.response && HTTP_FAILED_CODES.includes(err.response.status)) ||
        REQUEST_FAILED_CODES.includes(err.code))
    ) {
      self._logger.verbose(`ServerConnector retrying request with delay ${delayBeforeRetry}...`)

      if (delayBeforeRetry) {
        await GeneralUtils.sleep(RETRY_REQUEST_INTERVAL)
        return sendRequest(self, name, options, retry - 1, delayBeforeRetry)
      }

      return sendRequest(self, name, options, retry - 1, delayBeforeRetry)
    }

    throw new Error(reasonMsg)
  }
}

/**
 * @private
 * @param {ServerConnector} self
 * @param {string} name
 * @param {object} options
 * @param {number} delay
 * @return {Promise<AxiosResponse>}
 */
async function longRequestLoop(self, name, options, delaySequence, repeatCount = 0) {
  const delayIndex = Math.min(
    Math.floor(repeatCount / LONG_REQUEST_DELAY_REPEAT_COUNT),
    delaySequence.length - 1,
  )
  const delay = delaySequence[delayIndex]
  self._logger.verbose(`${name}: Still running... Retrying in ${delay} ms`)

  await GeneralUtils.sleep(delay)
  options.headers['Eyes-Date'] = DateTimeUtils.toRfc1123DateTime() // eslint-disable-line no-param-reassign

  const response = await sendRequest(self, name, options)
  if (response.status !== HTTP_STATUS_CODES.OK) {
    return response
  }
  return longRequestLoop(self, name, options, delaySequence, repeatCount + 1)
}

/**
 * @private
 * @param {ServerConnector} self
 * @param {string} name
 * @param {AxiosResponse} response
 * @return {Promise<AxiosResponse>}
 */
async function longRequestCheckStatus(self, name, response) {
  switch (response.status) {
    case HTTP_STATUS_CODES.OK: {
      return response
    }
    case HTTP_STATUS_CODES.ACCEPTED: {
      const options = self._createHttpOptions({
        method: 'GET',
        url: response.headers.location,
      })
      const requestResponse = await longRequestLoop(
        self,
        name,
        options,
        LONG_REQUEST_DELAY_SEQUENCE,
      )
      return longRequestCheckStatus(self, name, requestResponse)
    }
    case HTTP_STATUS_CODES.CREATED: {
      const options = self._createHttpOptions({
        method: 'DELETE',
        url: response.headers.location,
        headers: {'Eyes-Date': DateTimeUtils.toRfc1123DateTime()},
      })
      return sendRequest(self, name, options)
    }
    case HTTP_STATUS_CODES.GONE: {
      throw new Error('The server task has gone.')
    }
    default: {
      throw new Error(`Unknown error during long request: ${JSON.stringify(response)}`)
    }
  }
}

/**
 * @private
 * @param {ServerConnector} self
 * @param {string} name
 * @param {object} options
 * @return {Promise<AxiosResponse>}
 */
async function sendLongRequest(self, name, options = {}) {
  // extend headers of the request
  options.headers['Eyes-Expect'] = '202+location' // eslint-disable-line no-param-reassign
  options.headers['Eyes-Date'] = DateTimeUtils.toRfc1123DateTime() // eslint-disable-line no-param-reassign

  const response = await sendRequest(self, name, options)
  return longRequestCheckStatus(self, name, response)
}

exports.sendRequest = sendRequest
exports.sendLongRequest = sendLongRequest
