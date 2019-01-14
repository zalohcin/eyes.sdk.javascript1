'use strict';

const {ConfigUtils} = require('@applitools/eyes-common');

const defaultConfigParams = require('./configParams');

function makeGetConfig({configParams, configPath} = {}) {
  configParams = configParams ? defaultConfigParams.concat(configParams) : defaultConfigParams;
  const config = ConfigUtils.getConfig({configParams, configPath});

  return function getConfig() {
    return config;
  };
}

function toEnvVarName(camelCaseStr) {
  return ConfigUtils.toEnvVarName(camelCaseStr);
}

module.exports = {
  makeGetConfig,
  toEnvVarName,
};
