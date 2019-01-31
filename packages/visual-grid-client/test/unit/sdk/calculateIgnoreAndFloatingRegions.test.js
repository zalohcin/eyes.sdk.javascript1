'use strict';

const {describe, it} = require('mocha');
const {expect} = require('chai');
const calculateIgnoreAndFloatingRegions = require('../../../src/sdk/calculateIgnoreAndFloatingRegions');

describe('calculateIgnoreAndFloatingRegions', () => {
  it('handles null ignore regions', () => {
    const {ignoreRegions, floatingRegions} = calculateIgnoreAndFloatingRegions({});
    expect(ignoreRegions).to.be.undefined;
    expect(floatingRegions).to.be.undefined;
  });

  it('handles non-selector ignore regions', () => {
    const ignore = ['bla'];
    expect(calculateIgnoreAndFloatingRegions({ignore})).to.eql({
      ignoreRegions: ignore,
      floatingRegions: undefined,
    });
  });

  it('handles single ignore region', () => {
    const ignore = {bla: 'kuku'};
    expect(calculateIgnoreAndFloatingRegions({ignore})).to.eql({
      ignoreRegions: ignore,
      floatingRegions: undefined,
    });
  });

  it('handles single floating region', () => {
    const floating = {bla: 'kuku'};
    expect(calculateIgnoreAndFloatingRegions({floating})).to.eql({
      ignoreRegions: undefined,
      floatingRegions: floating,
    });
  });

  it('handles selector ignore regions without image offset', () => {
    const ignore = [{selector: 'bla'}, {selector: 'kuku'}];
    const selectorRegions = [{toJSON: () => 'aaa'}, {toJSON: () => 'bbb'}];
    expect(calculateIgnoreAndFloatingRegions({ignore, selectorRegions})).to.eql({
      ignoreRegions: ['aaa', 'bbb'],
      floatingRegions: undefined,
    });
  });

  it('handles selector floating regions without image offset', () => {
    const offset = x => ({
      maxUpOffset: x + 1,
      maxDownOffset: x + 2,
      maxRightOffset: x + 3,
      maxLeftOffset: x + 4,
    });
    const floating = [{selector: 'bla'}, {selector: 'kuku'}].map((x, i) =>
      Object.assign(x, offset(i)),
    );
    const selectorRegions = [{toJSON: () => ({bla: 'aaa'})}, {toJSON: () => ({kuku: 'bbb'})}];
    expect(calculateIgnoreAndFloatingRegions({floating, selectorRegions})).to.eql({
      ignoreRegions: undefined,
      floatingRegions: [{bla: 'aaa'}, {kuku: 'bbb'}].map((x, i) => Object.assign(x, offset(i))),
    });
  });

  it('handles selector ignore regions *with* image offset', () => {
    const ignore = [{selector: 'bla'}];
    const selectorRegions = [
      undefined,
      {getLeft: () => 1, getTop: () => 2, getWidth: () => 3, getHeight: () => 4},
    ];
    const imageLocationRegion = {getLeft: () => 1, getTop: () => 2};

    expect(
      calculateIgnoreAndFloatingRegions({ignore, selectorRegions, imageLocationRegion}),
    ).to.eql({
      ignoreRegions: [
        {
          width: 3,
          height: 4,
          left: 0,
          top: 0,
        },
      ],
      floatingRegions: undefined,
    });
  });

  it('handles selector ignore regions *with* image offset, correcting negative coordinates in output', () => {
    const ignore = [{selector: 'bla'}];
    const selectorRegions = [
      undefined,
      {getLeft: () => 1, getTop: () => 2, getWidth: () => 3, getHeight: () => 4},
    ];
    const imageLocationRegion = {getLeft: () => 3, getTop: () => 4};

    expect(
      calculateIgnoreAndFloatingRegions({ignore, selectorRegions, imageLocationRegion}),
    ).to.eql({
      ignoreRegions: [
        {
          width: 3,
          height: 4,
          left: 0,
          top: 0,
        },
      ],
      floatingRegions: undefined,
    });
  });

  it('handles combined selector ignore regions and normal ignore regions', () => {
    const ignore = ['kuku', {selector: 'bla'}, 'bubu', {selector: 'clams'}];
    const selectorRegions = [{toJSON: () => 'aaa'}, {toJSON: () => 'bbb'}];

    expect(calculateIgnoreAndFloatingRegions({ignore, selectorRegions})).to.eql({
      ignoreRegions: ['kuku', 'aaa', 'bubu', 'bbb'],
      floatingRegions: undefined,
    });
  });

  it('handles ignore regions and floating regions', () => {
    const offset = x => ({
      maxUpOffset: x + 1,
      maxDownOffset: x + 2,
      maxRightOffset: x + 3,
      maxLeftOffset: x + 4,
    });
    const ignore = ['kuku', {selector: 'bla'}, 'bubu', {selector: 'clams'}];
    const floating = [{kuku: 'kuku'}, {selector: 'bla'}, {bubu: 'bubu'}, {selector: 'clams'}].map(
      (x, i) => Object.assign(x, offset(i)),
    );
    const selectorRegions = [
      {toJSON: () => 'aaa'},
      {toJSON: () => 'bbb'},
      {toJSON: () => ({ccc: 'ccc'})},
      {toJSON: () => ({ddd: 'ddd'})},
    ];

    expect(calculateIgnoreAndFloatingRegions({ignore, floating, selectorRegions})).to.eql({
      ignoreRegions: ['kuku', 'aaa', 'bubu', 'bbb'],
      floatingRegions: [{kuku: 'kuku'}, {ccc: 'ccc'}, {bubu: 'bubu'}, {ddd: 'ddd'}].map((x, i) =>
        Object.assign(x, offset(i)),
      ),
    });
  });
});
