'use strict';
const retryFetch = require('@applitools/http-commons/src/retryFetch');
const createResourceCache = require('./createResourceCache');

function makeFetchResource({logger, retries = 5, fetchCache = createResourceCache(), fetch}) {
  return url => fetchCache.getValue(url) || fetchCache.setValue(url, doFetchResource(url));

  function doFetchResource(url, options) {
    return retryFetch(
      retry => {
        logger.log(`fetching ${url} ${retry ? `(retry ${retry}/${retries})` : ''}`);
        return fetch(url, options).then(resp =>
          (resp.buffer ? resp.buffer() : resp.arrayBuffer().then(buff => Buffer.from(buff))).then(
            buff => ({
              url,
              type: resp.headers.get('Content-Type'),
              value: buff,
            }),
          ),
        );
      },
      {retries},
    ).then(result => {
      logger.log(`fetched ${url}`);
      return result;
    });
  }
}

module.exports = makeFetchResource;
