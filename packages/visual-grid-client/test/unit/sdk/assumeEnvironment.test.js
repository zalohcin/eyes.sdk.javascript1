'use strict';
const {describe, it} = require('mocha');
const {expect} = require('chai');
const assumeEnvironment = require('../../../src/sdk/assumeEnvironment');

describe('assumeEnvironment', () => {
  it('works for default', () => {
    const env = assumeEnvironment({});
    expect(env).to.deep.equal({
      viewportSize: undefined,
      deviceInfo: 'Desktop',
      hostAppInfo: 'chrome',
      hostOSInfo: 'Linux',
    });
  });

  it('works for firefox', () => {
    const width = 100;
    const height = 200;
    const name = 'firefox';
    const env = assumeEnvironment({width, height, name});
    expect(env).to.deep.equal({
      viewportSize: {width: 100, height: 200},
      deviceInfo: 'Desktop',
      hostAppInfo: 'firefox',
      hostOSInfo: 'Linux',
    });
  });

  it('works for emulation', () => {
    const env = assumeEnvironment({deviceName: 'IPad'});
    expect(env).to.deep.equal({
      viewportSize: undefined,
      deviceInfo: 'IPad (Chrome emulation)',
      hostAppInfo: 'chrome',
      hostOSInfo: 'Linux',
    });
  });

  it('works for explorer', () => {
    const width = 100;
    const height = 200;
    const env = assumeEnvironment({width, height, name: 'ie 11'});
    expect(env).to.deep.equal({
      viewportSize: {width: 100, height: 200},
      deviceInfo: 'Desktop',
      hostAppInfo: 'ie 11',
      hostOSInfo: 'Windows',
    });
    const env2 = assumeEnvironment({width, height, name: 'ie 10'});
    expect(env2).to.deep.equal({
      viewportSize: {width: 100, height: 200},
      deviceInfo: 'Desktop',
      hostAppInfo: 'ie 10',
      hostOSInfo: 'Windows',
    });
    const env3 = assumeEnvironment({width, height, name: 'edge'});
    expect(env3).to.deep.equal({
      viewportSize: {width: 100, height: 200},
      deviceInfo: 'Desktop',
      hostAppInfo: 'edge',
      hostOSInfo: 'Windows',
    });
  });
});
