'use strict';
const {describe, it, _before, _after, _beforeEach, _afterEach} = require('mocha');
const {expect} = require('chai');
const {processResourceUrlsAndBlobs} = require('../index');

describe('processPage', () => {
  const fetchUrl = async url => {
    switch (url) {
      case 'http://blah':
        return {url, value: 'blah'};
      case 'http://blahblah':
        return {url, value: 'blahblah'};
      case 'http://blahblahblah':
        return {url, value: 'blahblahblah'};
    }
  };
  it('works', async () => {
    const resourceUrls = ['http://blah', 'http://blahblah', 'http://blahblahblah'];
    const result = await processResourceUrlsAndBlobs({resourceUrls, fetchUrl});
    expect(result.resourceUrls).not.to.be.empty;
    expect(result.blobs).not.to.be.empty;
  });
});
