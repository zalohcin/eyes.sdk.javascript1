'use strict';
const {describe, it, beforeEach, afterEach} = require('mocha');
const {expect} = require('chai');
const {makeGetConfig, toEnvVarName} = require('../../../src/sdk/config');
const {resolve} = require('path');

describe('config', () => {
  let prevEnv;
  const configPath = resolve(__dirname, 'fixtures');

  function makeGetConfigAtConfigPath() {
    const cwd = process.cwd();
    process.chdir(configPath);
    const getConfig = makeGetConfig();
    process.chdir(cwd);
    return getConfig;
  }

  beforeEach(() => {
    prevEnv = process.env;
    process.env = {};
  });

  afterEach(() => {
    process.env = prevEnv;
  });

  it('loads default config from file', () => {
    const getConfig = makeGetConfigAtConfigPath();
    const config = getConfig();
    const expectedConfig = {saveDebugData: true, apiKey: 'default api key'};
    expect(config).to.eql(expectedConfig);
  });

  it('loads config with env variables', () => {
    process.env.APPLITOOLS_API_KEY = 'env api key';
    const getConfig = makeGetConfigAtConfigPath();
    const config = getConfig();
    const expectedConfig = {apiKey: 'env api key', saveDebugData: true};
    expect(config).to.eql(expectedConfig);
  });

  it('handles custom configParams', () => {
    const getConfig = makeGetConfig({configParams: ['bla']});
    expect(getConfig().bla).to.equal(undefined);
    process.env.APPLITOOLS_BLA = 'aaa';
    const getConfigWithBla = makeGetConfig({configParams: ['bla']});
    delete process.env.APPLITOOLS_BLA;
    expect(getConfigWithBla().bla).to.equal('aaa');
  });

  it('handles custom configPath', () => {
    const getConfig = makeGetConfig({configPath: resolve(configPath, 'eyes.json')});
    const expectedConfig = {saveDebugData: true, apiKey: 'default api key'};
    expect(getConfig()).to.eql(expectedConfig);
  });
});

describe('toEnvVarName', () => {
  it('works', () => {
    expect(toEnvVarName('someCamelCase')).to.equal('SOME_CAMEL_CASE');
    expect(toEnvVarName('CapitalSomeCamelCase')).to.equal('CAPITAL_SOME_CAMEL_CASE');
  });
});
