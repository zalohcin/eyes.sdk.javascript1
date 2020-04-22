'use strict'

const {cosmiconfigSync} = require('cosmiconfig')
const {join} = require('path')
const {GeneralUtils} = require('./GeneralUtils')
const {Logger} = require('../logging/Logger')

const _CONFIG_FILE_NAMES = ['applitools.config.js', 'package.json', 'eyes.config.js', 'eyes.json']

/**
 * @ignore
 */
class ConfigUtils {
  static getConfig({
    configParams = [],
    configPath,
    logger = new Logger(process.env.APPLITOOLS_SHOW_LOGS),
  } = {}) {
    const explorer = cosmiconfigSync('applitools', {
      searchPlaces: _CONFIG_FILE_NAMES,
    })

    let defaultConfig = {}
    try {
      const path = GeneralUtils.getEnvValue('CONFIG_PATH') || configPath
      const fullPath = path && ConfigUtils._fullConfigPath(path)
      const result = fullPath ? explorer.load(fullPath) : explorer.search()

      if (result) {
        const {config, filepath} = result
        logger.log('Loading configuration from', filepath)
        defaultConfig = config
      }
    } catch (ex) {
      logger.log(`An error occurred while loading configuration. configPath=${configPath}\n`, ex)
    }

    const envConfig = {}
    for (const p of configParams) {
      envConfig[p] = GeneralUtils.getEnvValue(ConfigUtils.toEnvVarName(p))
      if (envConfig[p] === 'true') {
        envConfig[p] = true
      } else if (envConfig[p] === 'false') {
        envConfig[p] = false
      }
    }

    Object.keys(envConfig).forEach(value => {
      if (envConfig[value] === undefined) {
        delete envConfig[value]
      }
    })

    return Object.assign({}, defaultConfig, envConfig)
  }

  /**
   * @param {string} camelCaseStr
   * @return {string}
   */
  static toEnvVarName(camelCaseStr) {
    return camelCaseStr.replace(/(.)([A-Z])/g, '$1_$2').toUpperCase()
  }

  static _fullConfigPath(path) {
    const isFullPath = _CONFIG_FILE_NAMES.some(name => path.endsWith(name))
    return isFullPath ? path : join(path, 'applitools.config.js')
  }
}

exports.ConfigUtils = ConfigUtils
