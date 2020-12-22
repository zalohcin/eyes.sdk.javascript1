'use strict'
const retryFetch = require('@applitools/http-commons/src/retryFetch')
const createResourceCache = require('./createResourceCache')

const psetTimeout = t =>
  new Promise(res => {
    setTimeout(res, t)
  })

const noTimeout = new Promise(() => {})
function bufferTimeout(response, url, timeout) {
  const canBeStreaming =
    !response.headers.get('Content-Length') &&
    ['audio/', 'video/'].some(prefix => response.headers.get('Content-Type').startsWith(prefix))

  if (canBeStreaming) {
    return psetTimeout(timeout).then(() =>
      Promise.reject(new Error(`timeout when downloading ${url} content`)),
    )
  } else {
    return noTimeout
  }
}

function makeFetchResource({
  logger,
  retries = 5,
  fetchCache = createResourceCache(),
  fetch,
  mediaDownloadTimeout = 30 * 1000,
}) {
  return (url, opts) =>
    fetchCache.getValue(url) || fetchCache.setValue(url, doFetchResource(url, opts))

  async function doFetchResource(url, opts) {
    const resp = await retryFetch(
      async retry => {
        const retryStr = retry ? `(retry ${retry}/${retries})` : ''
        const optsStr = JSON.stringify(opts) || ''
        logger.verbose(`fetching ${url} ${retryStr} ${optsStr}`)

        return await fetch(url, opts)
      },
      {retries},
    )

    if (!resp.ok) {
      logger.verbose(`failed to fetch ${url} status ${resp.status}, returning errorStatusCode`)
      return {url, errorStatusCode: resp.status}
    }

    logger.verbose(`fetched ${url}`)

    const bufferPromise = resp.buffer ? resp.buffer() : resp.arrayBuffer()
    const buffer = await Promise.race([
      bufferPromise,
      bufferTimeout(resp, url, mediaDownloadTimeout),
    ])
    return {
      url,
      type: resp.headers.get('Content-Type'),
      value: Buffer.from(buffer),
    }
  }
}

module.exports = makeFetchResource
