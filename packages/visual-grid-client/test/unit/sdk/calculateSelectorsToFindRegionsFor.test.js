'use strict'

const {describe, it} = require('mocha')
const {expect} = require('chai')
const calculateSelectorsToFindRegionsFor = require('../../../src/sdk/calculateSelectorsToFindRegionsFor')

describe('calculateSelectorsToFindRegionsFor', () => {
  it('handles no sizeMode selector and no selectors', () => {
    expect(calculateSelectorsToFindRegionsFor({noOffsetSelectors: [], offsetSelectors: []})).to.be
      .undefined
    expect(
      calculateSelectorsToFindRegionsFor({
        noOffsetSelectors: [],
        offsetSelectors: [],
        sizeMode: 'bla',
      }),
    ).to.be.undefined
  })

  it('handles sizeMode selector, but no selectors', () => {
    expect(
      calculateSelectorsToFindRegionsFor({
        noOffsetSelectors: [],
        offsetSelectors: [],
        sizeMode: 'selector',
        selector: 'bla',
      }),
    ).to.eql(['bla'])
  })

  it('handles no sizeMode selector, with no-offset selector', () => {
    expect(
      calculateSelectorsToFindRegionsFor({
        noOffsetSelectors: [{type: 'css', selector: 'bla'}],
        offsetSelectors: [],
      }),
    ).to.eql([{type: 'css', selector: 'bla'}])
  })

  it('handles no sizeMode selector, with no-offset second index selector', () => {
    expect(
      calculateSelectorsToFindRegionsFor({
        noOffsetSelectors: [undefined, {type: 'xpath', selector: 'bla'}],
        offsetSelectors: [],
      }),
    ).to.eql([{type: 'xpath', selector: 'bla'}])
  })

  it('handles no sizeMode selector, with no-offset multiple selectors', () => {
    expect(
      calculateSelectorsToFindRegionsFor({
        noOffsetSelectors: [
          undefined,
          {type: 'css', selector: 'bla'},
          {type: 'xpath', selector: 'bla2'},
        ],
        offsetSelectors: [],
      }),
    ).to.eql([
      {type: 'css', selector: 'bla'},
      {type: 'xpath', selector: 'bla2'},
    ])
  })

  it('handles no sizeMode selector, with no-offset array', () => {
    expect(
      calculateSelectorsToFindRegionsFor({
        noOffsetSelectors: [[{type: 'css', selector: 'bla'}], undefined, undefined],
        offsetSelectors: [],
      }),
    ).to.eql([{type: 'css', selector: 'bla'}])
  })

  it('handles no sizeMode selector, with no-offset second index array', () => {
    expect(
      calculateSelectorsToFindRegionsFor({
        noOffsetSelectors: [undefined, [{type: 'xpath', selector: 'bla'}], undefined],
        offsetSelectors: [],
      }),
    ).to.eql([{type: 'xpath', selector: 'bla'}])
  })

  it('handles no sizeMode selector, with no-offset multiple arrays', () => {
    expect(
      calculateSelectorsToFindRegionsFor({
        noOffsetSelectors: [
          [{type: 'css', selector: 'bla'}],
          undefined,
          [{type: 'css', selector: 'bla2'}],
        ],
        offsetSelectors: [],
      }),
    ).to.eql([
      {type: 'css', selector: 'bla'},
      {type: 'css', selector: 'bla2'},
    ])
  })

  it('handles no sizeMode selector, with combined no-offset arrays and selectors', () => {
    expect(
      calculateSelectorsToFindRegionsFor({
        noOffsetSelectors: [
          undefined,
          [{type: 'css', selector: 'bla'}],
          {type: 'css', selector: 'bla2'},
        ],
        offsetSelectors: [],
      }),
    ).to.eql([
      {type: 'css', selector: 'bla'},
      {type: 'css', selector: 'bla2'},
    ])
  })

  it('handles no sizeMode selector, with no-offset combined selector and absolute regions', () => {
    expect(
      calculateSelectorsToFindRegionsFor({
        noOffsetSelectors: [
          [{a: 'b'}, {type: 'xpath', selector: 'bla'}, {c: 'd'}, {type: 'xpath', selector: 'kuku'}],
          undefined,
          undefined,
        ],
        offsetSelectors: [],
      }),
    ).to.eql([
      {type: 'xpath', selector: 'bla'},
      {type: 'xpath', selector: 'kuku'},
    ])
  })

  it('handles no sizeMode selector, with no-offset combined selector and absolute regions', () => {
    expect(
      calculateSelectorsToFindRegionsFor({
        noOffsetSelectors: [
          [{a: 'b'}, {type: 'xpath', selector: 'bla'}, {c: 'd'}, {type: 'xpath', selector: 'kuku'}],
          [{a: 'b'}, {type: 'css', selector: 'aaa'}, {c: 'd'}, {type: 'css', selector: 'bbb'}],
          undefined,
        ],
        offsetSelectors: [],
      }),
    ).to.eql([
      {type: 'xpath', selector: 'bla'},
      {type: 'xpath', selector: 'kuku'},
      {type: 'css', selector: 'aaa'},
      {type: 'css', selector: 'bbb'},
    ])
  })

  it('handles no sizeMode selector, with offset-selector', () => {
    expect(
      calculateSelectorsToFindRegionsFor({
        noOffsetSelectors: [undefined, undefined, undefined],
        offsetSelectors: [{type: 'css', selector: 'bla'}],
      }),
    ).to.eql([{type: 'css', selector: 'bla'}])
  })

  it('handles no sizeMode selector, with offset-selector array', () => {
    expect(
      calculateSelectorsToFindRegionsFor({
        noOffsetSelectors: [undefined, undefined, undefined],
        offsetSelectors: [[{type: 'css', selector: 'bla'}]],
      }),
    ).to.eql([{type: 'css', selector: 'bla'}])
  })

  it('handles no sizeMode selector, with offset combined selector and absolute regions', () => {
    expect(
      calculateSelectorsToFindRegionsFor({
        noOffsetSelectors: [undefined, undefined, undefined],
        offsetSelectors: [
          [{a: 'b'}, {type: 'css', selector: 'bla'}, {c: 'd'}, {type: 'css', selector: 'kuku'}],
        ],
      }),
    ).to.eql([
      {type: 'css', selector: 'bla'},
      {type: 'css', selector: 'kuku'},
    ])
  })

  it('handles no sizeMode selector, no-offset AND offset selectors', () => {
    expect(
      calculateSelectorsToFindRegionsFor({
        noOffsetSelectors: [
          {type: 'css', selector: 'ignore'},
          {type: 'css', selector: 'layout'},
          {type: 'css', selector: 'strict'},
          {type: 'css', selector: 'content'},
        ],
        offsetSelectors: [{type: 'css', selector: 'float'}],
      }),
    ).to.eql([
      {type: 'css', selector: 'ignore'},
      {type: 'css', selector: 'layout'},
      {type: 'css', selector: 'strict'},
      {type: 'css', selector: 'content'},
      {type: 'css', selector: 'float'},
    ])
  })

  it('handles sizeMode selector, with no-offset AND offset selectors', () => {
    expect(
      calculateSelectorsToFindRegionsFor({
        sizeMode: 'selector',
        selector: 'selector',
        noOffsetSelectors: [
          {type: 'css', selector: 'ignore'},
          {type: 'css', selector: 'layout'},
          {type: 'css', selector: 'strict'},
          {type: 'css', selector: 'content'},
        ],
        offsetSelectors: [{type: 'css', selector: 'float'}],
      }),
    ).to.eql([
      'selector',
      {type: 'css', selector: 'ignore'},
      {type: 'css', selector: 'layout'},
      {type: 'css', selector: 'strict'},
      {type: 'css', selector: 'content'},
      {type: 'css', selector: 'float'},
    ])
  })

  it('handles no sizeMode selector, with no-offset selector AND offset selector *arrays* (including duplicates)', () => {
    expect(
      calculateSelectorsToFindRegionsFor({
        noOffsetSelectors: [
          [
            {a: 'b'},
            {type: 'css', selector: 'bla'},
            {c: 'd'},
            {type: 'css', selector: 'kuku'},
            {type: 'css', selector: 'ignore'},
          ],
          [{a: 'b'}, {type: 'css', selector: 'bla'}, {c: 'd'}, {type: 'css', selector: 'layout'}],
          [{a: 'b'}, {type: 'css', selector: 'bla'}, {c: 'd'}, {type: 'css', selector: 'strict'}],
          [{a: 'b'}, {type: 'css', selector: 'bla'}, {c: 'd'}, {type: 'css', selector: 'content'}],
        ],
        offsetSelectors: [
          [
            {a: 'b'},
            {type: 'css', selector: 'bla'},
            {c: 'd'},
            {type: 'css', selector: 'kuku'},
            {type: 'css', selector: 'float'},
          ],
        ],
      }),
    ).to.eql([
      {type: 'css', selector: 'bla'},
      {type: 'css', selector: 'kuku'},
      {type: 'css', selector: 'ignore'},
      {type: 'css', selector: 'bla'},
      {type: 'css', selector: 'layout'},
      {type: 'css', selector: 'bla'},
      {type: 'css', selector: 'strict'},
      {type: 'css', selector: 'bla'},
      {type: 'css', selector: 'content'},
      {type: 'css', selector: 'bla'},
      {type: 'css', selector: 'kuku'},
      {type: 'css', selector: 'float'},
    ])
  })

  it('handles sizeMode selector, with no-offset selector AND offset selector *arrays* (including duplicates)', () => {
    expect(
      calculateSelectorsToFindRegionsFor({
        noOffsetSelectors: [
          [
            {a: 'b'},
            {type: 'css', selector: 'bla'},
            {c: 'd'},
            {type: 'css', selector: 'kuku'},
            {type: 'css', selector: 'ignore'},
          ],
          {type: 'css', selector: 'layout'},
          [{type: 'css', selector: 'strict'}, {type: 'css', selector: 'yo'}, {d: 'g'}],
          [{type: 'css', selector: 'content'}],
        ],
        offsetSelectors: [
          [
            {a: 'b'},
            {type: 'css', selector: 'bla'},
            {c: 'd'},
            {type: 'css', selector: 'kuku'},
            {type: 'css', selector: 'float'},
          ],
        ],
        sizeMode: 'selector',
        selector: 'selector',
      }),
    ).to.eql([
      'selector',
      {type: 'css', selector: 'bla'},
      {type: 'css', selector: 'kuku'},
      {type: 'css', selector: 'ignore'},
      {type: 'css', selector: 'layout'},
      {type: 'css', selector: 'strict'},
      {type: 'css', selector: 'yo'},
      {type: 'css', selector: 'content'},
      {type: 'css', selector: 'bla'},
      {type: 'css', selector: 'kuku'},
      {type: 'css', selector: 'float'},
    ])
  })
})
