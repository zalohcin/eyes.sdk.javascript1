/* eslint-disable no-console */

'use strict';

const { exec } = require('child_process');
const { promisify: p } = require('util');
const { ServerConnector } = require('../../index');
const {
  ConfigUtils,
  Configuration,
} = require('../../index');

const config = ConfigUtils.getConfig({ configParams: ['apiKey', 'serverUrl'] });
const configuration = new Configuration(config);
const apiKey = configuration.getApiKey();


const pexec = p(exec);
const curlGet = async (url) => {
  const { stdout } = await pexec(`curl -X GET ${url}`, { maxBuffer: 10000000 });
  return stdout;
};

const getServer = (() => {
  let server;
  console.verbose = console.log;
  return () => {
    if (!server) {
      server = new ServerConnector({ verbose: () => {}, log: () => {} }, configuration);
    }
    return server;
  };
})();

const presult = promise => promise.then(v => [undefined, v], err => [err]);

exports.presult = presult;
exports.pexec = pexec;
exports.apiKey = apiKey;
exports.userConfig = config;
exports.configuration = configuration;
exports.curlGet = curlGet;
exports.getServer = getServer;
