'use strict';
const fetch = require('node-fetch');

function makeUploadResource(logger) {
  return async function uploadResource(url, data) {
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: '*',
        'Content-Type': 'application/octet-stream',
      },
      body: data,
    });

    if (resp.status !== 201) {
      throw new Error(`upload resource failed with status ${resp.status}`);
    }

    const location = resp.headers.get('location');

    logger.log('resource uploaded to ', location);

    return location;
  };
}

module.exports = makeUploadResource;
