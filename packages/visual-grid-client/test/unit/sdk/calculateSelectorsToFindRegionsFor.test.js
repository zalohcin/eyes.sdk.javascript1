'use strict';

const {describe, it} = require('mocha');
const {expect} = require('chai');
const calculateSelectorsToFindRegionsFor = require('../../../src/sdk/calculateSelectorsToFindRegionsFor');

describe('calculateSelectorsToFindRegionsFor', () => {
  it('handles no sizeMode selector, no ignore and floating', () => {
    expect(calculateSelectorsToFindRegionsFor({})).to.be.undefined;
    expect(calculateSelectorsToFindRegionsFor({sizeMode: 'bla'})).to.be.undefined;
  });

  it('handles sizeMode selector, but no ignore and floating', () => {
    expect(calculateSelectorsToFindRegionsFor({sizeMode: 'selector', selector: 'bla'})).to.eql([
      'bla',
    ]);
  });

  it('handles no sizeMode selector, with ignore', () => {
    expect(calculateSelectorsToFindRegionsFor({ignore: {selector: 'bla'}})).to.eql(['bla']);
  });

  it('handles no sizeMode selector, with ignore array', () => {
    expect(calculateSelectorsToFindRegionsFor({ignore: [{selector: 'bla'}]})).to.eql(['bla']);
  });

  it('handles no sizeMode selector, with ignore combined selector and absolute regions', () => {
    expect(
      calculateSelectorsToFindRegionsFor({
        ignore: [{a: 'b'}, {selector: 'bla'}, {c: 'd'}, {selector: 'kuku'}],
      }),
    ).to.eql(['bla', 'kuku']);
  });

  it('handles no sizeMode selector, with floating', () => {
    expect(calculateSelectorsToFindRegionsFor({floating: {selector: 'bla'}})).to.eql(['bla']);
  });

  it('handles no sizeMode selector, with floating array', () => {
    expect(calculateSelectorsToFindRegionsFor({floating: [{selector: 'bla'}]})).to.eql(['bla']);
  });

  it('handles no sizeMode selector, with floating combined selector and absolute regions', () => {
    expect(
      calculateSelectorsToFindRegionsFor({
        floating: [{a: 'b'}, {selector: 'bla'}, {c: 'd'}, {selector: 'kuku'}],
      }),
    ).to.eql(['bla', 'kuku']);
  });

  it('handles no sizeMode selector, with ignore AND floating', () => {
    expect(
      calculateSelectorsToFindRegionsFor({
        ignore: {selector: 'ignore'},
        floating: {selector: 'float'},
      }),
    ).to.eql(['ignore', 'float']);
  });

  it('handles sizeMode selector, with ignore AND floating', () => {
    expect(
      calculateSelectorsToFindRegionsFor({
        sizeMode: 'selector',
        selector: 'selector',
        ignore: {selector: 'ignore'},
        floating: {selector: 'float'},
      }),
    ).to.eql(['selector', 'ignore', 'float']);
  });

  it('handles no sizeMode selector, with ignore AND floating *arrays* (including duplicates)', () => {
    expect(
      calculateSelectorsToFindRegionsFor({
        ignore: [{a: 'b'}, {selector: 'bla'}, {c: 'd'}, {selector: 'kuku'}, {selector: 'ignore'}],
        floating: [{a: 'b'}, {selector: 'bla'}, {c: 'd'}, {selector: 'kuku'}, {selector: 'float'}],
      }),
    ).to.eql(['bla', 'kuku', 'ignore', 'bla', 'kuku', 'float']);
  });

  it('handles sizeMode selector, with ignore AND floating *arrays* (including duplicates)', () => {
    expect(
      calculateSelectorsToFindRegionsFor({
        sizeMode: 'selector',
        selector: 'selector',
        ignore: [{a: 'b'}, {selector: 'bla'}, {c: 'd'}, {selector: 'kuku'}, {selector: 'ignore'}],
        floating: [{a: 'b'}, {selector: 'bla'}, {c: 'd'}, {selector: 'kuku'}, {selector: 'float'}],
      }),
    ).to.eql(['selector', 'bla', 'kuku', 'ignore', 'bla', 'kuku', 'float']);
  });
});
