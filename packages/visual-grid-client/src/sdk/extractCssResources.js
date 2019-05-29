'use strict';
const {mapCssUrls} = require('@applitools/rendering-resource-rewrite');
const absolutizeUrl = require('./absolutizeUrl');

function makeExtractCssResources(logger) {
  return function extractCssResources(cssContent, absoluteUrl) {
    const urls = [];
    try {
      mapCssUrls({cssContent, onFoundUrl, resourceMap: []});
    } catch (e) {
      logger.log('could not parse css for urls', e);
    }

    function onFoundUrl(url) {
      urls.push(url);
      return url;
    }
    return [...new Set(urls)].map(url => absolutizeUrl(url, absoluteUrl));
  };
}

module.exports = makeExtractCssResources;
