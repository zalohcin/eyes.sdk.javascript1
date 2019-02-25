'use strict';

const { expect } = require('chai');
const { RenderingConfiguration } = require('../../index');

describe('RenderingConfiguration', () => {
  it('should parse empty config', () => {
    const config = {};
    const cfg = RenderingConfiguration.fromObject(config);
    expect(cfg).to.be.instanceOf(RenderingConfiguration);
  });
  it('should parse a single browser', () => {
    const config = {
      browser: {
        width: 1920,
        height: 1080,
        name: 'chrome',
      },
    };
    const cfg = RenderingConfiguration.fromObject(config);
    expect(cfg._browsersInfo.length).to.equal(1);
    expect(cfg._browsersInfo[0].name).to.equal(config.browser.name);
    expect(cfg._browsersInfo[0].width).to.equal(config.browser.width);
    expect(cfg._browsersInfo[0].height).to.equal(config.browser.height);
  });
  it('should parse config from array', () => {
    const config = {
      browser: [
        {
          width: 1920,
          height: 1080,
          name: 'chrome',
        },
        {
          width: 800,
          height: 600,
          name: 'firefox',
        },
        {
          deviceName: 'iPhone 4',
          screenOrientation: 'portrait',
        },
      ],
    };
    const cfg = RenderingConfiguration.fromObject(config);
    expect(cfg._browsersInfo.length).to.equal(config.browser.length);
    expect(cfg._browsersInfo[0].name).to.equal(config.browser[0].name);
    expect(cfg._browsersInfo[1].name).to.equal(config.browser[1].name);
    expect(cfg._browsersInfo[2].deviceName).to.equal(config.browser[2].deviceName);
  });
  it('should fail to parse invalid config', () => {
    const config = undefined;
    expect(() => RenderingConfiguration.fromObject(config)).to.throw();
  });
});
