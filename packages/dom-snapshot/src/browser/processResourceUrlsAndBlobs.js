'use strict';
const aggregateResourceUrlsAndBlobs = require('./aggregateResourceUrlsAndBlobs');
const makeProcessResource = require('./processResource');
const makeGetResourceUrlsAndBlobs = require('./getResourceUrlsAndBlobs');
const makeFindStyleSheetByUrl = require('./findStyleSheetByUrl');
const getCorsFreeStyleSheet = require('./getCorsFreeStyleSheet');
const makeExtractResourcesFromStyleSheet = require('./extractResourcesFromStyleSheet');
const {CSSRule} = require('cssom');
const makeExtractResourceUrlsFromStyleTags = require('./extractResourceUrlsFromStyleTags');
const makeExtractResourcesFromSvg = require('./makeExtractResourcesFromSvg');
const absolutizeUrl = require('./absolutizeUrl');
const makeLog = require('./log');
const noop = require('./noop');

function processResourceUrlsAndBlobs({
  fetchUrl = () => {
    throw new Error('fetchUrl not implemented');
  },
  resourceUrls = [],
  showLogs,
} = {}) {
  const styleSheetCache = {};
  const findStyleSheetByUrl = makeFindStyleSheetByUrl({styleSheetCache});
  const extractResourcesFromStyleSheet = makeExtractResourcesFromStyleSheet({
    styleSheetCache,
    CSSRule,
  });
  const extractResourceUrlsFromStyleTags = makeExtractResourceUrlsFromStyleTags(
    extractResourcesFromStyleSheet,
  );
  const extractResourcesFromSvg = makeExtractResourcesFromSvg({extractResourceUrlsFromStyleTags});
  const log = showLogs ? makeLog(Date.now()) : noop;
  const processResource = makeProcessResource({
    fetchUrl,
    findStyleSheetByUrl,
    getCorsFreeStyleSheet,
    extractResourcesFromStyleSheet,
    extractResourcesFromSvg,
    absolutizeUrl,
    log,
  });
  const getResourceUrlsAndBlobs = makeGetResourceUrlsAndBlobs({
    processResource,
    aggregateResourceUrlsAndBlobs,
  });
  return getResourceUrlsAndBlobs({urls: resourceUrls}).then(result => {
    const urls = Object.keys(result.blobsObj);
    const blobsObj = result.blobsObj;
    return {
      resourceUrls: urls.map(url => url.replace(/^blob:/, '')),
      blobs: blobsObjToArray(blobsObj),
    };
  });
}

function blobsObjToArray(blobsObj) {
  return Object.keys(blobsObj).map(blobUrl =>
    Object.assign(
      {
        url: blobUrl.replace(/^blob:/, ''),
      },
      blobsObj[blobUrl],
    ),
  );
}

module.exports = processResourceUrlsAndBlobs;
