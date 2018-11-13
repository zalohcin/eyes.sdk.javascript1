/* global URL */
'use strict';
const domNodesToCdt = require('./domNodesToCdt');
const absolutizeUrl = require('../sdk/absolutizeUrl');

function isSameOrigin(location, url) {
  const {origin} = location.protocol === 'data:' ? location.origin : new URL(url, location.href);
  return origin === location.origin || /^blob:/.test(url);
}

function splitOnOrigin(location, urls) {
  const result = urls.reduce(
    (output, url) => {
      if (isSameOrigin(location, url)) {
        output.internalUrls.push(url);
      } else {
        output.externalUrls.push(url);
      }
      return output;
    },
    {
      externalUrls: [],
      internalUrls: [],
    },
  );
  return result;
}

function uniq(arr) {
  return Array.from(new Set(arr)).filter(x => !!x);
}

function extractLinks(document) {
  const win = document.defaultView;

  const srcsetUrls = [...document.querySelectorAll('img[srcset],source[srcset]')]
    .map(srcsetEl =>
      srcsetEl
        .getAttribute('srcset')
        .split(',')
        .map(str => str.trim().split(/\s+/)[0]),
    )
    .reduce((acc, urls) => acc.concat(urls), []);

  const srcUrls = [...document.querySelectorAll('img[src],source[src]')].map(srcEl =>
    srcEl.getAttribute('src'),
  );

  const cssUrls = [...document.querySelectorAll('link[rel="stylesheet"]')].map(link =>
    link.getAttribute('href'),
  );

  const videoPosterUrls = [...document.querySelectorAll('video[poster]')].map(videoEl =>
    videoEl.getAttribute('poster'),
  );

  const splitUrls = splitOnOrigin(win.location, [
    ...srcsetUrls,
    ...srcUrls,
    ...cssUrls,
    ...videoPosterUrls,
  ]);

  const iframes = [...document.querySelectorAll('iframe[src]')]
    .map(srcEl => {
      try {
        return srcEl.contentDocument;
      } catch (err) {
        //for CORS frames
        return undefined;
      }
    })
    .filter(x => !!x);

  return {
    requiresMoreParsing: uniq(iframes),
    externalUrls: uniq(splitUrls.externalUrls).map(url => {
      try {
        return absolutizeUrl(url, win.location);
      } catch (err) {
        return url;
      }
    }),
    urlsToFetch: uniq(splitUrls.internalUrls).map(url => absolutizeUrl(url, win.location)),
  };
}

//eslint-disable-next-line no-undef
function fetchLocalResources(origin, blobUrls, fetch = window.fetch) {
  return Promise.all(
    blobUrls.map(blobUrl =>
      fetch(blobUrl, {cache: 'force-cache', credentials: 'same-origin'}).then(resp =>
        resp.arrayBuffer().then(buff => ({
          url: new URL(blobUrl.replace(/^blob:http:\/\/localhost:\d+\/(.+)/, '$1'), origin).href, // TODO don't replace localhost once render-grid implements absolute urls
          type: resp.headers.get('Content-Type'),
          value: buff,
        })),
      ),
    ),
  );
}

function processPage(doc) {
  const url = doc.defaultView.frameElement
    ? doc.defaultView.frameElement.src
    : doc.defaultView.location.href;

  let {urlsToFetch, externalUrls, requiresMoreParsing} = extractLinks(doc);
  return fetchLocalResources(url, urlsToFetch, doc.defaultView.fetch).then(blobs => {
    return Promise.all(requiresMoreParsing.map(frame => processPage(frame))).then(
      framesResults => ({
        cdt: domNodesToCdt(doc),
        url,
        resourceUrls: externalUrls,
        blobs,
        frames: framesResults,
        allBlobs: framesResults.reduce((blobAgg, frame) => {
          return uniq([...blobAgg, ...frame.allBlobs]);
        }, blobs),
      }),
    );
  });
}

const processDocument = new Function(
  'doc',
  `${isSameOrigin}
  ${absolutizeUrl}
    ${uniq}
    ${splitOnOrigin}
    ${extractLinks}
    ${fetchLocalResources}
    ${processPage}
    ${domNodesToCdt}
    return processPage(doc);`,
);

module.exports = {
  uniq,
  isSameOrigin,
  splitOnOrigin,
  extractLinks,
  processPage,
  fetchLocalResources,
  processDocument,
};
