'use strict';

const { resolve } = require('path');
const { equal, deepEqual } = require('assert');
const { describe, it, beforeEach, afterEach } = require('mocha');

const { ConfigUtils } = require('../../../index');

describe('ConfigUtils', () => {
  describe('getConfig()', () => {
    let prevEnv;
    const configPath = resolve(__dirname, '..', '..', 'fixtures');

    function getConfigAtConfigPath(args) {
      const cwd = process.cwd();
      process.chdir(configPath);
      const config = ConfigUtils.getConfig(args);
      process.chdir(cwd);
      return config;
    }

    beforeEach(() => {
      prevEnv = process.env;
      process.env = {};
    });

    afterEach(() => {
      process.env = prevEnv;
    });

    it('loads default config from file', () => {
      const config = getConfigAtConfigPath();
      const expectedConfig = { bla: 'kuku', it: 'works' };
      deepEqual(config, expectedConfig);
    });

    it('loads config with env variables', () => {
      process.env.APPLITOOLS_BLA = 'env kuku';
      const config = getConfigAtConfigPath({ configParams: ['bla'] });
      const expectedConfig = { bla: 'env kuku', it: 'works' };
      deepEqual(config, expectedConfig);
    });

    it('handles custom configParams', () => {
      const config = ConfigUtils.getConfig({ configParams: ['bla'] });
      equal(config.bla, undefined);

      process.env.APPLITOOLS_BLA = 'aaa';
      const configWithBla = ConfigUtils.getConfig({ configParams: ['bla'] });
      delete process.env.APPLITOOLS_BLA;
      equal(configWithBla.bla, 'aaa');
    });

    it('handles custom configPath', () => {
      const config = ConfigUtils.getConfig({ configPath: resolve(configPath, 'eyes.json') });
      const expectedConfig = { saveDebugData: true, apiKey: 'default api key' };
      deepEqual(config, expectedConfig);
    });
  });

  describe('toEnvVarName()', () => {
    it('works', () => {
      equal(ConfigUtils.toEnvVarName('someCamelCase'), 'SOME_CAMEL_CASE');
      equal(ConfigUtils.toEnvVarName('CapitalSomeCamelCase'), 'CAPITAL_SOME_CAMEL_CASE');
    });
  });
});
