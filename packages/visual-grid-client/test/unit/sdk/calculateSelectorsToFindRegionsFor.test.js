'use strict'

const {describe, it} = require('mocha')
const {expect} = require('chai')
const calculateSelectorsToFindRegionsFor = require('../../../src/sdk/calculateSelectorsToFindRegionsFor')

describe('calculateSelectorsToFindRegionsFor Tests', () => {
  describe('calculateSelectorsToFindRegionsFor', () => {
    it('handles no arguments', () => {
      const {selectorsToFindRegionsFor} = calculateSelectorsToFindRegionsFor({})
      expect(selectorsToFindRegionsFor).to.be.undefined
    })

    it('handles sizeMode without selector or selectors', () => {
      const {selectorsToFindRegionsFor} = calculateSelectorsToFindRegionsFor({sizeMode: 'bla'})
      expect(selectorsToFindRegionsFor).to.be.undefined
    })

    it('handles sizeMode with selector, but no selectors', () => {
      const {selectorsToFindRegionsFor} = calculateSelectorsToFindRegionsFor({
        sizeMode: 'selector',
        selector: 'bla',
      })
      expect(selectorsToFindRegionsFor).to.eql(['bla'])
    })

    it('handles no sizeMode with selector', () => {
      const ignore = [{selector: 'bla'}]
      const {selectorsToFindRegionsFor} = calculateSelectorsToFindRegionsFor({ignore})
      expect(selectorsToFindRegionsFor).to.eql(['bla'])
    })

    it('handles non-array selectors', () => {
      const layout = {selector: 'bla'}
      const content = {selector: 'bla2'}
      const {selectorsToFindRegionsFor} = calculateSelectorsToFindRegionsFor({layout, content})
      expect(selectorsToFindRegionsFor).to.eql(['bla', 'bla2'])
    })

    it('handles array selectors', () => {
      const ignore = [{selector: 'bla'}]
      const layout = [{selector: 'blu'}]
      const {selectorsToFindRegionsFor} = calculateSelectorsToFindRegionsFor({ignore, layout})
      expect(selectorsToFindRegionsFor).to.eql(['bla', 'blu'])
    })

    it('handles non-array differnt index selectors without sizeMode or selector', () => {
      const layout = {selector: 'bla'}
      const {selectorsToFindRegionsFor} = calculateSelectorsToFindRegionsFor({layout})
      expect(selectorsToFindRegionsFor).to.eql(['bla'])
    })

    it('handles array different index selectors without sizeMode or selector', () => {
      const layout = [{selector: 'bla'}]
      const {selectorsToFindRegionsFor} = calculateSelectorsToFindRegionsFor({layout})
      expect(selectorsToFindRegionsFor).to.eql(['bla'])
    })

    it('handles only selectors without sizeMode or selector', () => {
      const ignore = [{a: 'b'}, {selector: 'bla'}, {c: 'd'}, {selector: 'kuku'}]
      const {selectorsToFindRegionsFor} = calculateSelectorsToFindRegionsFor({ignore})
      expect(selectorsToFindRegionsFor).to.eql(['bla', 'kuku'])
    })

    it('handles sizeMode = selector, with selector', () => {
      const ignore = [{selector: 'ignore'}]
      const layout = [{selector: 'layout'}]
      const {selectorsToFindRegionsFor} = calculateSelectorsToFindRegionsFor({
        sizeMode: 'selector',
        selector: 'some_selector',
        ignore,
        layout,
      })
      expect(selectorsToFindRegionsFor).to.eql(['some_selector', 'ignore', 'layout'])
    })

    it('handles sizeMode = selector, without selector', () => {
      const {selectorsToFindRegionsFor} = calculateSelectorsToFindRegionsFor({
        sizeMode: 'selector',
        ignore: [{selector: 'ignore'}],
      })
      expect(selectorsToFindRegionsFor).to.eql([undefined, 'ignore'])
    })

    it('handles multiple selector arrays with duplicates and without sizeMode or selector', () => {
      const ignore = [
        {a: 'b'},
        {selector: 'bla'},
        {c: 'd'},
        {selector: 'kuku'},
        {selector: 'ignore'},
      ]
      const layout = [{a: 'b'}, {selector: 'bla'}, {c: 'd'}, {selector: 'layout'}]
      const strict = [{a: 'b'}, {selector: 'bla'}, {c: 'd'}, {selector: 'strict'}]
      const content = [{a: 'b'}, {selector: 'bla'}, {c: 'd'}, {selector: 'content'}]
      const floating = [
        {a: 'b'},
        {selector: 'bla'},
        {c: 'd'},
        {selector: 'kuku'},
        {selector: 'float'},
      ]
      const {selectorsToFindRegionsFor} = calculateSelectorsToFindRegionsFor({
        ignore,
        layout,
        strict,
        content,
        floating,
      })
      expect(selectorsToFindRegionsFor).to.eql([
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

    it('handles multiple selector arrays with duplicates and with sizeMode = selector', () => {
      const ignore = [
        {a: 'b'},
        {selector: 'bla'},
        {c: 'd'},
        {selector: 'kuku'},
        {selector: 'ignore'},
      ]
      const layout = {selector: 'layout'}
      const strict = [{selector: 'strict'}, {selector: 'yo'}, {d: 'g'}]
      const content = [{selector: 'content'}]
      const floating = [
        {a: 'b'},
        {selector: 'bla'},
        {c: 'd'},
        {selector: 'kuku'},
        {selector: 'float'},
      ]
      const {selectorsToFindRegionsFor} = calculateSelectorsToFindRegionsFor({
        ignore,
        layout,
        strict,
        content,
        floating,
        sizeMode: 'selector',
        selector: 'some_selector',
      })
      expect(selectorsToFindRegionsFor).to.eql([
        'some_selector',
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
      const ignore = {selector: 'bla'}
      const layout = {type: 'css', selector: 'bla1'}
      const strict = {type: 'xpath', selector: 'bla2'}
      const content = {type: 'css selector', selector: 'kuku'}
      const floating = {type: 'link text', selector: 'kuku1'}
      const {selectorsToFindRegionsFor} = calculateSelectorsToFindRegionsFor({
        ignore,
        layout,
        strict,
        content,
        floating,
      })
      expect(selectorsToFindRegionsFor).to.eql([
        'bla',
        {type: 'css', selector: 'bla1'},
        {type: 'xpath', selector: 'bla2'},
        'kuku',
        'kuku1',
      ])
    })
  })

  describe('getMatchRegions', () => {})
})
