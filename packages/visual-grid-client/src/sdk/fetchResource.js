'use strict';
const fetch = require('node-fetch');
const {retryFetch} = require('@applitools/http-commons');

function makeFetchResource({logger, retries = 5, fetchCache}) {
  return url =>
    fetchCache.getValue(url) ||
    fetchCache.setValue(
      url,
      retryFetch(retry => doFetchResource(url, retry), {retries}).then(result => {
        logger.log(`fetched ${url}`);
        return result;
      }),
    );

  function doFetchResource(url, retry) {
    logger.log(`fetching ${url} ${retry ? `(retry ${retry}/${retries})` : ''}`);
    return fetch(url).then(resp =>
      resp.buffer().then(buff => ({
        url,
        type: resp.headers.get('Content-Type'),
        value: buff,
      })),
    );
  }
}

module.exports = makeFetchResource;
