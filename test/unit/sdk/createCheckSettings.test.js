'use strict';
const {
  Region,
  IgnoreRegionByRectangle,
  FloatingRegionByRectangle,
} = require('@applitools/eyes.sdk.core');
const {describe, it} = require('mocha');
const {expect} = require('chai');
const createCheckSettings = require('../../../src/sdk/createCheckSettings');

describe('createCheckSettings', () => {
  it('handles single ignore region', () => {
    const checkSettings = createCheckSettings({ignore: {left: 1, top: 2, width: 3, height: 4}});
    expect(checkSettings.getIgnoreRegions()).to.eql([
      new IgnoreRegionByRectangle(Region.fromObject({left: 1, top: 2, width: 3, height: 4})),
    ]);
  });

  it('handles multiple ignore regions', () => {
    const ignore = [{left: 1, top: 2, width: 3, height: 4}, {left: 5, top: 6, width: 7, height: 8}];
    const expected = ignore.map(region => new IgnoreRegionByRectangle(Region.fromObject(region)));
    const checkSettings = createCheckSettings({ignore});
    expect(checkSettings.getIgnoreRegions()).to.eql(expected);
  });

  it('throws on non-region ignore input', async () => {
    const err = await Promise.resolve()
      .then(() => createCheckSettings({ignore: 'bla'}))
      .then(x => x, err => err);
    expect(err).to.be.an.instanceof(Error);
  });

  it('handles single floating region', () => {
    const checkSettings = createCheckSettings({
      floating: {
        left: 1,
        top: 2,
        width: 3,
        height: 4,
        maxUpOffset: 5,
        maxDownOffset: 6,
        maxLeftOffset: 7,
        maxRightOffset: 8,
      },
    });
    expect(checkSettings.getFloatingRegions()).to.eql([
      new FloatingRegionByRectangle(
        Region.fromObject({left: 1, top: 2, width: 3, height: 4}),
        5,
        6,
        7,
        8,
      ),
    ]);
  });

  it('handles multiple floating regions', () => {
    const floating = [
      {
        left: 1,
        top: 2,
        width: 3,
        height: 4,
        maxUpOffset: 5,
        maxDownOffset: 6,
        maxLeftOffset: 7,
        maxRightOffset: 8,
      },
      {
        left: 10,
        top: 11,
        width: 12,
        height: 13,
        maxUpOffset: 14,
        maxDownOffset: 15,
        maxLeftOffset: 16,
        maxRightOffset: 17,
      },
    ];
    const expected = floating.map(
      region =>
        new FloatingRegionByRectangle(
          Region.fromObject(region),
          region.maxUpOffset,
          region.maxDownOffset,
          region.maxLeftOffset,
          region.maxRightOffset,
        ),
    );
    const checkSettings = createCheckSettings({floating});
    expect(checkSettings.getFloatingRegions()).to.eql(expected);
  });

  it('throws on non-region floating input', async () => {
    const err = await Promise.resolve()
      .then(() => createCheckSettings({floating: 'bla'}))
      .then(x => x, err => err);
    expect(err).to.be.an.instanceof(Error);
  });
});
