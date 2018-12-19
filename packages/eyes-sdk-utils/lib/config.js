'use strict';
const createLogger = require('./createLogger');
const cosmiconfig = require('cosmiconfig');
const logger = createLogger(process.env.APPLITOOLS_SHOW_LOGS); // TODO when switching to DEBUG sometime remove this env var
const explorer = cosmiconfig('applitools', {
  searchPlaces: ['package.json', 'applitools.config.js', 'eyes.config.js', 'eyes.json'],
});

function makeGetConfig({configParams = [], configPath} = {}) {
  let defaultConfig = {};
  try {
    const result = configPath ? explorer.loadSync(configPath) : explorer.searchSync();
    if (result) {
      const {config, filepath} = result;
      logger.log('loading configuration from', filepath);
      defaultConfig = config;
    }
  } catch (ex) {
    logger.log(`an error occurred while loading configuration. configPath=${configPath}\n`, ex);
  }

  const envConfig = {};
  for (const p of configParams) {
    envConfig[p] = process.env[`APPLITOOLS_${toEnvVarName(p)}`];
  }

  for (const p in envConfig) {
    if (envConfig[p] === undefined) delete envConfig[p];
  }

  const config = Object.assign({}, defaultConfig, envConfig);

  return function getConfig() {
    return config;
  };
}

function toEnvVarName(camelCaseStr) {
  return camelCaseStr.replace(/(.)([A-Z])/g, '$1_$2').toUpperCase();
}

module.exports = {
  makeGetConfig,
  toEnvVarName,
};
