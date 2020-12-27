'use strict';

function makePluginExport({ startServer, config }) {
  return function pluginExport(pluginModule) {
    let closeEyesServer;
    const pluginModuleExports = pluginModule.exports;
    pluginModule.exports = async (...args) => {
      const { eyesPort, closeServer } = await startServer();

      closeEyesServer = closeServer;
      const moduleExportsResult = await pluginModuleExports(...args);
      // prefix each config key with `eyes` to avoid conflicts with Cypress config
      const eyesConfig = Object.keys(config).reduce((eyesConfig, key) => {
        const firstLetter = key[0].toUpperCase();
        const upperCased = 'eyes' + firstLetter + key.substring(1)
        const value = typeof config[key] === "object" ? JSON.stringify(config[key]) : config[key]
        eyesConfig[upperCased] = value;
        return eyesConfig;
      }, {})

      return Object.assign(eyesConfig, { eyesPort }, moduleExportsResult);
    };

    return function getCloseServer() {
      return closeEyesServer;
    };
  };
}

module.exports = makePluginExport;
