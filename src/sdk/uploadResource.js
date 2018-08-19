'use strict';
const fetch = require('node-fetch');

async function uploadResource(url, data) {
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

  return resp.headers.get('location');
}

module.exports = uploadResource;
