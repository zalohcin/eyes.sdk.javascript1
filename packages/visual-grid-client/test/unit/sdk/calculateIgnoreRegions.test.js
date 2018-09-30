'use strict';

const {describe, it} = require('mocha');
const {expect} = require('chai');
const calculateIgnoreRegions = require('../../../src/sdk/calculateIgnoreRegions');

describe('calculateIgnoreRegions', () => {
  it('handles null ignore regions', () => {
    expect(calculateIgnoreRegions({})).to.be.undefined;
  });

  it('handles non-selector ignore regions', () => {
    const ignore = ['bla'];
    expect(calculateIgnoreRegions({ignore})).to.eql(ignore);
  });

  it('handles selector ignore regions without image offset', () => {
    const ignore = [{selector: 'bla'}, {selector: 'kuku'}];
    const selectorRegions = [{toJSON: () => 'aaa'}, {toJSON: () => 'bbb'}];
    expect(calculateIgnoreRegions({ignore, selectorRegions})).to.eql(['aaa', 'bbb']);
  });

  it('handles selector ignore regions *with* image offset', () => {
    const ignore = [{selector: 'bla'}];
    const selectorRegions = [
      undefined,
      {getLeft: () => 1, getTop: () => 2, getWidth: () => 3, getHeight: () => 4},
    ];
    const imageLocationRegion = {getLeft: () => 1, getTop: () => 2};

    expect(calculateIgnoreRegions({ignore, selectorRegions, imageLocationRegion})).to.eql([
      {
        width: 3,
        height: 4,
        left: 0,
        top: 0,
      },
    ]);
  });

  it('handles selector ignore regions *with* image offset, correcting negative coordinates in output', () => {
    const ignore = [{selector: 'bla'}];
    const selectorRegions = [
      undefined,
      {getLeft: () => 1, getTop: () => 2, getWidth: () => 3, getHeight: () => 4},
    ];
    const imageLocationRegion = {getLeft: () => 3, getTop: () => 4};

    expect(calculateIgnoreRegions({ignore, selectorRegions, imageLocationRegion})).to.eql([
      {
        width: 3,
        height: 4,
        left: 0,
        top: 0,
      },
    ]);
  });

  it('handles combined selector ignore regions and normal ignore regions', () => {
    const ignore = ['kuku', {selector: 'bla'}, 'bubu', {selector: 'clams'}];
    const selectorRegions = [{toJSON: () => 'aaa'}, {toJSON: () => 'bbb'}];

    expect(calculateIgnoreRegions({ignore, selectorRegions})).to.eql([
      'kuku',
      'aaa',
      'bubu',
      'bbb',
    ]);
  });
});
