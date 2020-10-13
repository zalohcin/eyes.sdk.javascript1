'use strict'

const {describe, it} = require('mocha')
const {expect} = require('chai')
const calculateSelectorsToFindRegionsFor = require('../../../src/sdk/calculateSelectorsToFindRegionsFor')

describe('calculateSelectorsToFindRegionsFor', () => {
  it('handles no sizeMode selector and no selectors', () => {
    expect(calculateSelectorsToFindRegionsFor({userRegions: []})).to.be.undefined
    expect(calculateSelectorsToFindRegionsFor({userRegions: [], sizeMode: 'bla'})).to.be.undefined
  })

  it('handles sizeMode selector, but no selectors', () => {
    expect(
      calculateSelectorsToFindRegionsFor({
        userRegions: [],
        sizeMode: 'selector',
        selector: 'bla',
      }),
    ).to.eql(['bla'])
  })

  it('handles no sizeMode selector, with no-offset selector', () => {
    expect(calculateSelectorsToFindRegionsFor({userRegions: [{selector: 'bla'}]})).to.eql(['bla'])
  })

  it('handles no sizeMode selector, with no-offset second index selector', () => {
    expect(
      calculateSelectorsToFindRegionsFor({userRegions: [undefined, {selector: 'bla'}]}),
    ).to.eql(['bla'])
  })

  it('handles no sizeMode selector, with no-offset multiple selectors', () => {
    expect(
      calculateSelectorsToFindRegionsFor({
        userRegions: [undefined, {selector: 'bla'}, {selector: 'bla2'}],
      }),
    ).to.eql(['bla', 'bla2'])
  })

  it('handles no sizeMode selector, with no-offset array', () => {
    expect(
      calculateSelectorsToFindRegionsFor({
        userRegions: [{selector: 'bla'}, undefined, undefined],
      }),
    ).to.eql(['bla'])
  })

  it('handles no sizeMode selector, with no-offset second index array', () => {
    expect(
      calculateSelectorsToFindRegionsFor({
        userRegions: [undefined, {selector: 'bla'}, undefined],
      }),
    ).to.eql(['bla'])
  })

  it('handles no sizeMode selector, with no-offset multiple arrays', () => {
    expect(
      calculateSelectorsToFindRegionsFor({
        userRegions: [{selector: 'bla'}, undefined, {selector: 'bla2'}],
      }),
    ).to.eql(['bla', 'bla2'])
  })

  it('handles no sizeMode selector, with combined no-offset arrays and selectors', () => {
    expect(
      calculateSelectorsToFindRegionsFor({
        userRegions: [undefined, {selector: 'bla'}, {selector: 'bla2'}],
      }),
    ).to.eql(['bla', 'bla2'])
  })

  it('handles no sizeMode selector, with no-offset combined selector and absolute regions', () => {
    expect(
      calculateSelectorsToFindRegionsFor({
        userRegions: [
          {a: 'b'},
          {selector: 'bla'},
          {c: 'd'},
          {selector: 'kuku'},
          undefined,
          undefined,
        ],
      }),
    ).to.eql(['bla', 'kuku'])
  })

  it('handles no sizeMode selector, with no-offset combined selector and absolute regions', () => {
    expect(
      calculateSelectorsToFindRegionsFor({
        userRegions: [
          {a: 'b'},
          {selector: 'bla'},
          {c: 'd'},
          {selector: 'kuku'},
          {a: 'b'},
          {selector: 'aaa'},
          {c: 'd'},
          {selector: 'bbb'},
          undefined,
        ],
      }),
    ).to.eql(['bla', 'kuku', 'aaa', 'bbb'])
  })

  it('handles no sizeMode selector, with offset-selector', () => {
    expect(
      calculateSelectorsToFindRegionsFor({
        userRegions: [undefined, undefined, undefined, {selector: 'bla'}],
      }),
    ).to.eql(['bla'])
  })

  it('handles no sizeMode selector, with offset-selector array', () => {
    expect(
      calculateSelectorsToFindRegionsFor({
        userRegions: [undefined, undefined, undefined, {selector: 'bla'}],
      }),
    ).to.eql(['bla'])
  })

  it('handles no sizeMode selector, with offset combined selector and absolute regions', () => {
    expect(
      calculateSelectorsToFindRegionsFor({
        userRegions: [
          undefined,
          undefined,
          undefined,
          {a: 'b'},
          {selector: 'bla'},
          {c: 'd'},
          {selector: 'kuku'},
        ],
      }),
    ).to.eql(['bla', 'kuku'])
  })

  it('handles no sizeMode selector, no-offset AND offset selectors', () => {
    expect(
      calculateSelectorsToFindRegionsFor({
        userRegions: [
          {selector: 'ignore'},
          {selector: 'layout'},
          {selector: 'strict'},
          {selector: 'content'},
          {selector: 'float'},
        ],
      }),
    ).to.eql(['ignore', 'layout', 'strict', 'content', 'float'])
  })

  it('handles sizeMode selector, with no-offset AND offset selectors', () => {
    expect(
      calculateSelectorsToFindRegionsFor({
        sizeMode: 'selector',
        selector: 'selector',
        userRegions: [
          {selector: 'ignore'},
          {selector: 'layout'},
          {selector: 'strict'},
          {selector: 'content'},
          {selector: 'float'},
        ],
      }),
    ).to.eql(['selector', 'ignore', 'layout', 'strict', 'content', 'float'])
  })

  it('handles no sizeMode selector, with no-offset selector AND offset selector *arrays* (including duplicates)', () => {
    expect(
      calculateSelectorsToFindRegionsFor({
        userRegions: [
          {a: 'b'},
          {selector: 'bla'},
          {c: 'd'},
          {selector: 'kuku'},
          {selector: 'ignore'},
          {a: 'b'},
          {selector: 'bla'},
          {c: 'd'},
          {selector: 'layout'},
          {a: 'b'},
          {selector: 'bla'},
          {c: 'd'},
          {selector: 'strict'},
          {a: 'b'},
          {selector: 'bla'},
          {c: 'd'},
          {selector: 'content'},
          {a: 'b'},
          {selector: 'bla'},
          {c: 'd'},
          {selector: 'kuku'},
          {selector: 'float'},
        ],
      }),
    ).to.eql([
      'bla',
      'kuku',
      'ignore',
      'bla',
      'layout',
      'bla',
      'strict',
      'bla',
      'content',
      'bla',
      'kuku',
      'float',
    ])
  })

  it('handles sizeMode selector, with no-offset selector AND offset selector *arrays* (including duplicates)', () => {
    expect(
      calculateSelectorsToFindRegionsFor({
        userRegions: [
          {a: 'b'},
          {selector: 'bla'},
          {c: 'd'},
          {selector: 'kuku'},
          {selector: 'ignore'},
          {selector: 'layout'},
          {selector: 'strict'},
          {selector: 'yo'},
          {d: 'g'},
          {selector: 'content'},
          {a: 'b'},
          {selector: 'bla'},
          {c: 'd'},
          {selector: 'kuku'},
          {selector: 'float'},
        ],
        sizeMode: 'selector',
        selector: 'selector',
      }),
    ).to.eql([
      'selector',
      'bla',
      'kuku',
      'ignore',
      'layout',
      'strict',
      'yo',
      'content',
      'bla',
      'kuku',
      'float',
    ])
  })

  it('handles well formated typed selectors', () => {
    expect(
      calculateSelectorsToFindRegionsFor({
        userRegions: [
          {selector: 'bla'},
          {type: 'css', selector: 'bla1'},
          {type: 'xpath', selector: 'bla2'},
          {type: 'css selector', selector: 'kuku'},
          {type: 'link text', selector: 'kuku1'},
        ],
      }),
    ).to.eql([
      'bla',
      {type: 'css', selector: 'bla1'},
      {type: 'xpath', selector: 'bla2'},
      'kuku',
      'kuku1',
    ])
  })
})
