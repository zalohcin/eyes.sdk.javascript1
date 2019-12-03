/* eslint-disable no-console */

'use strict';

const axios = require('axios');
const {
  RGridResource,
  RunningRender,
} = require('../../index');
const {
  curlGet,
  pexec,
  presult,
  getServer,
} = require('./utils');
const { url: renderInfoUrl } = require('./eyes');
require('@applitools/isomorphic-fetch');

const VG_URL = 'https://render-wus.applitools.com';

const validateVgResult = (res, sha) => {
  if (!res || res.hash !== sha) {
    throw new Error(`bad VG result ${res}`);
  }
};

const getAuthToken = (() => {
  let accessToken;
  return async () => {
    const stdout = await curlGet(renderInfoUrl);
    try {
      accessToken = JSON.parse(stdout).accessToken;
      // eslint-disable-next-line no-empty
    } catch (e) {}
    return accessToken;
  };
})();

const getResource = (() => {
  const content = Buffer.from(
    JSON.stringify({
      resources: {},
      domNodes: [],
    })
  );
  let resource;
  return () => {
    if (!resource) {
      resource = new RGridResource({ content, contentType: 'x-applitools-html/cdt' });
    }
    return resource;
  };
})();

const getPutUrl = async () => {
  const resource = await getResource();
  return `${VG_URL}/sha256/${resource.getSha256Hash()}?render-id=fake`;
};

const getCurlCmd = async () => {
  const resource = getResource();
  const data = resource.getContent();
  const url = await getPutUrl();
  return `curl -X PUT -H "Content-Type: application/json" -H "X-Auth-Token: ${await getAuthToken()}" -d '${data}' ${url}`;
};

const testFetch = async () => {
  const resource = await getResource();
  const authToken = await getAuthToken();
  const url = await getPutUrl();
  const response = await global.fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'x-applitools-html/cdt',
      'X-Auth-Token': authToken,
    },
    body: resource.getContent(),
  });
  const res = await response.json();
  validateVgResult(res, resource.getSha256Hash());
};

const testCurl = async () => {
  const resource = getResource();
  const cmd = await getCurlCmd();
  const { stdout } = await pexec(cmd, { maxBuffer: 10000000 });
  validateVgResult(JSON.parse(stdout), resource.getSha256Hash());
};

const testAxios = async () => {
  const resource = getResource();
  const authToken = await getAuthToken();
  const url = await getPutUrl();
  const options = {
    method: 'PUT',
    url,
    headers: {
      'X-Auth-Token': authToken,
      'Content-Type': 'x-applitools-html/cdt',
    },
    params: {
      'render-id': 'fake',
    },
    data: resource.getContent(),
  };
  const [err, res] = await presult(axios(options));
  if (err) {
    throw err;
  }
  validateVgResult(res.data, resource.getSha256Hash());
};

const testServer = async () => {
  const resource = await getResource();
  const rr = new RunningRender({ renderId: 'fake' });
  const server = getServer();
  const [err, res] = await presult(server.renderPutResource(rr, resource));
  if (err || !res) {
    throw new Error('bad VG result', err);
  }
};

exports.testServer = testServer;
exports.testAxios = testAxios;
exports.testCurl = testCurl;
exports.testFetch = testFetch;
exports.getCurlCmd = getCurlCmd;
exports.url = VG_URL;
