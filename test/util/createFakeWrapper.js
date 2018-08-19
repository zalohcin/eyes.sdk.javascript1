'use strict';
const FakeEyesWrapper = require('./FakeEyesWrapper');

function createFakeWrapper(baseUrl) {
  return new FakeEyesWrapper({
    goodFilename: 'test.cdt.json',
    goodResourceUrls: [`${baseUrl}/smurfs.jpg`, `${baseUrl}/test.css`],
    goodTags: ['good1', 'good2'],
  });
}

module.exports = createFakeWrapper;
