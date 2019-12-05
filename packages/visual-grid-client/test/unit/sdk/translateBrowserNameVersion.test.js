'use strict';
const {describe, it} = require('mocha');
const {expect} = require('chai');
const translateBrowserNameVersion = require('../../../src/sdk/translateBrowserNameVersion');

describe('translateBrowserNameVersion', () => {
  it('outputs the same input value if no translation is needed', async () => {
    expect(translateBrowserNameVersion('')).to.equal('');
    expect(translateBrowserNameVersion(undefined)).to.equal(undefined);
    expect(translateBrowserNameVersion('bla')).to.equal('bla');
    expect(translateBrowserNameVersion('chrome')).to.equal('chrome');
    expect(translateBrowserNameVersion('ie10')).to.equal('ie10');
    expect(translateBrowserNameVersion('bla-chrome-one-version-back-bla')).to.equal('bla-chrome-one-version-back-bla'); // eslint-disable-line prettier/prettier
  });

  it('translates to -1 and -2 for supported browsers', async () => {
    expect(translateBrowserNameVersion('chrome-one-version-back')).to.equal('chrome-1');
    expect(translateBrowserNameVersion('chrome-two-versions-back')).to.equal('chrome-2');
    expect(translateBrowserNameVersion('firefox-one-version-back')).to.equal('firefox-1');
    expect(translateBrowserNameVersion('firefox-two-versions-back')).to.equal('firefox-2');
    expect(translateBrowserNameVersion('safari-one-version-back')).to.equal('safari-1');
    expect(translateBrowserNameVersion('safari-two-versions-back')).to.equal('safari-2');
  });

  it("doesn't translate to -1 and -2 for unsupported browsers", async () => {
    expect(translateBrowserNameVersion('edge-one-version-back')).to.equal('edge-one-version-back');
    expect(translateBrowserNameVersion('edge-two-versions-back')).to.equal('edge-two-versions-back'); // eslint-disable-line prettier/prettier
    expect(translateBrowserNameVersion('ie11-one-version-back')).to.equal('ie11-one-version-back');
    expect(translateBrowserNameVersion('ie11-two-versions-back')).to.equal('ie11-two-versions-back'); // eslint-disable-line prettier/prettier
    expect(translateBrowserNameVersion('ie10-one-version-back')).to.equal('ie10-one-version-back');
    expect(translateBrowserNameVersion('ie10-two-versions-back')).to.equal('ie10-two-versions-back'); // eslint-disable-line prettier/prettier
  });

  it("doesn't translate to -3 and onwards", async () => {
    expect(translateBrowserNameVersion('chrome-three-version-back')).to.equal('chrome-three-version-back'); // eslint-disable-line prettier/prettier
    expect(translateBrowserNameVersion('chrome-four-versions-back')).to.equal('chrome-four-versions-back'); // eslint-disable-line prettier/prettier
    expect(translateBrowserNameVersion('firefox-five-version-back')).to.equal('firefox-five-version-back'); // eslint-disable-line prettier/prettier
    expect(translateBrowserNameVersion('firefox-six-versions-back')).to.equal('firefox-six-versions-back'); // eslint-disable-line prettier/prettier
    expect(translateBrowserNameVersion('safari-seven-version-back')).to.equal('safari-seven-version-back'); // eslint-disable-line prettier/prettier
    expect(translateBrowserNameVersion('safari-eight-versions-back')).to.equal('safari-eight-versions-back'); // eslint-disable-line prettier/prettier
  });
});
