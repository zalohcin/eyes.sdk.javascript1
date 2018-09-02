'use strict';
const fetch = require('node-fetch');
const {retryFetch} = require('@applitools/http-commons');

function makeFetchResource(logger, retries = 5) {
  return url =>
    retryFetch(
      retry => {
        logger.log(`fetching ${url} ${retry ? `(retry ${retry}/${retries})` : ''}`);
        return fetch(url).then(resp =>
          resp.buffer().then(buff => ({
            url,
            type: resp.headers.get('Content-Type'),
            value: buff,
          })),
        );
      },
      {retries},
    ).then(result => {
      logger.log(`fetched ${url}`);
      return result;
    });
}

module.exports = makeFetchResource;
