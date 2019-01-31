'use strict';
const {describe, it} = require('mocha');
const {expect} = require('chai');
const {RGridResource} = require('@applitools/eyes-sdk-core');
const createRGridDom = require('../../../src/sdk/createRGridDom');

describe('createRGridDom', () => {
  it('sets dom and resources', () => {
    const resources = {some: 'resource'};
    const rGridDom = createRGridDom({cdt: 'cdt', resources});
    expect(rGridDom.getDomNodes()).to.equal('cdt');
    expect(rGridDom.getResources()).to.eql(['resource']);
  });

  it('sorts resources by key', () => {
    const aaa = new RGridResource();
    aaa.setUrl('a');
    aaa.setContent('aaa');

    const bbb = new RGridResource();
    bbb.setUrl('b');
    bbb.setContent('bbb');

    const ccc = new RGridResource();
    ccc.setUrl('c');
    ccc.setContent('ccc');

    const ddd = new RGridResource();
    ddd.setUrl('d');
    ddd.setContent('ddd');

    const eee = new RGridResource();
    eee.setUrl('e');
    eee.setContent('eee');

    const resources = {
      bbb,
      aaa,
      eee,
      ddd,
      ccc,
    };

    const rGridDom = createRGridDom({cdt: 'cdt', resources});

    const expected = [aaa, bbb, ccc, ddd, eee];

    expect(rGridDom.getResources()).to.eql(expected);

    // different order, should produce the same sha
    const resources2 = {
      eee,
      ddd,
      aaa,
      ccc,
      bbb,
    };

    const rGridDom2 = createRGridDom({cdt: 'cdt', resources: resources2});
    expect(rGridDom2.getSha256Hash()).to.equal(rGridDom.getSha256Hash());
  });
});
