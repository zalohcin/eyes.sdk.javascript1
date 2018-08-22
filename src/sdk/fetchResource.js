'use strict';
const fetch = require('node-fetch');
const {retryFetch} = require('@applitools/http-commons');

function makeFetchResource(logger) {
  return url => {
    logger.log(`fetching ${url}`);
    return retryFetch(
      _retry =>
        fetch(url).then(resp =>
          resp.buffer().then(buff => ({
            url,
            type: resp.headers.get('Content-Type'),
            value: buff,
          })),
        ),
      {retries: 5},
    );
  };
}

module.exports = makeFetchResource;
