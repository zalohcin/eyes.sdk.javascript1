'use strict';

function makePluginExport({startServer, config}) {
  return function pluginExport(pluginModule) {
    let closeEyesServer;
    const pluginModuleExports = pluginModule.exports;
    pluginModule.exports = async (...args) => {
      const {eyesPort, closeServer} = await startServer();

      closeEyesServer = closeServer;
      const moduleExportsResult = await pluginModuleExports(...args);
      // prefix each config key with `eyes` to avoid conflicts with Cypress config
      const eyesConfig = Object.keys(config).reduce(
        (userConfig, key) => {
          const firstLetter = key[0].toUpperCase();
          const upperCased = 'eyes' + firstLetter + key.substring(1);
          const value = typeof config[key] === 'object' ? JSON.stringify(config[key]) : config[key];
          if (key.startsWith('eyes')) {
            userConfig[key] = config[key];
          }
          if (!userConfig[key]) {
            userConfig[upperCased] = value;
          }
          return userConfig;
        },
        {eyesFailCypressOnDiff: true, eyesIsDisabled: false, eyesDisableBrowserFetching: false},
      );

      return Object.assign(eyesConfig, {eyesPort}, moduleExportsResult);
    };

    return function getCloseServer() {
      return closeEyesServer;
    };
  };
}

module.exports = makePluginExport;
