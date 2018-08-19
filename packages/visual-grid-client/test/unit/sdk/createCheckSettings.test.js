'use strict';
const {Region, IgnoreRegionByRectangle} = require('@applitools/eyes.sdk.core');
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
});
