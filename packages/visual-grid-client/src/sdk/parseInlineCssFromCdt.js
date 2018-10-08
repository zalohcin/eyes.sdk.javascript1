'use strict';

const mapKeys = require('lodash.mapkeys');
const mapValues = require('lodash.mapvalues');
const absolutizeUrl = require('./absolutizeUrl');

function makeParseInlineCssFromCdt(extractCssResourcesFromCdt) {
  return function parseInlineCssFromCdt({resourceUrls, cdt, url, resourceContents}) {
    const resourceUrlsWithCss = resourceUrls.concat(extractCssResourcesFromCdt(cdt, url));
    let absoluteUrls = resourceUrlsWithCss.map(resourceUrl => absolutizeUrl(resourceUrl, url));
    let absoluteResourceContents = mapValues(
      mapKeys(resourceContents, (_value, key) => absolutizeUrl(key, url)),
      ({url: resourceUrl, type, value}) => ({url: absolutizeUrl(resourceUrl, url), type, value}),
    );

    return {
      absoluteUrls,
      absoluteResourceContents,
    };
  };
}

module.exports = makeParseInlineCssFromCdt;
