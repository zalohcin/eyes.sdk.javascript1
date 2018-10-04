'use strict';
const domNodesToCdt = require('./domNodesToCdt');

function isSameOrigin(location, url) {
  //eslint-disable-next-line no-undef
  const {origin} = location.protocol === 'data:' ? location.origin : new URL(url, location.href);
  return origin === location.origin || /^blob:/.test(url);
}

function splitOnOrigin(
  location,
  urls,
  splitUrls = {
    externalUrls: [],
    internalUrls: [],
  },
) {
  const splitter = (...args) => isSameOrigin(location, ...args);
  const result = urls.reduce((output, url) => {
    if (splitter(url)) {
      output.internalUrls.push(url);
    } else {
      output.externalUrls.push(url);
    }
    return output;
  }, splitUrls);
  return result;
}

function uniq(arr) {
  return Array.from(new Set(arr)).filter(x => !!x);
}

function extractLinks(document) {
  const win = document.defaultView;

  const splitter = (...args) => splitOnOrigin(win.location, ...args);
  const srcUrls = [...document.querySelectorAll('img[src],source[src]')].map(srcEl =>
    srcEl.getAttribute('src'),
  );
  const splitUrls = splitter(srcUrls);

  const cssUrls = [...document.querySelectorAll('link[rel="stylesheet"]')].map(link =>
    link.getAttribute('href'),
  );

  splitter(cssUrls, splitUrls);

  const videoPosterUrls = [...document.querySelectorAll('video[poster]')].map(videoEl =>
    videoEl.getAttribute('poster'),
  );

  splitter(videoPosterUrls, splitUrls);

  const iframes = [...document.querySelectorAll('iframe[src]')]
    .map(srcEl => srcEl.contentDocument)
    .filter(x => !!x);

  const externalFramesUrls = Array.from(iframes)
    .map(frame => frame.defaultView.location)
    .filter(location => !isSameOrigin(win.location, location));

  splitUrls.externalUrls = [...splitUrls.externalUrls, ...externalFramesUrls];

  const framesToParse = Array.from(iframes).filter(frame =>
    isSameOrigin(win.location, frame.defaultView.location),
  );

  return {
    requiresMoreParsing: uniq(framesToParse),
    externalUrls: uniq(splitUrls.externalUrls),
    urlsToFetch: uniq(splitUrls.internalUrls),
  };
}

//eslint-disable-next-line no-undef
function fetchLocalResources(blobUrls, fetch = window.fetch) {
  return Promise.all(
    blobUrls.map(blobUrl =>
      //eslint-disable-next-line no-undef
      fetch(blobUrl, {cache: 'force-cache', credentials: 'same-origin'}).then(resp =>
        resp.arrayBuffer().then(buff => ({
          url: blobUrl.replace(/^blob:http:\/\/localhost:\d+\/(.+)/, '$1'), // TODO don't replace localhost once render-grid implements absolute urls
          type: resp.headers.get('Content-Type'),
          value: buff,
        })),
      ),
    ),
  );
}

function processPage(doc) {
  let links = extractLinks(doc);
  return fetchLocalResources(uniq(links.urlsToFetch), doc.defaultView).then(blobs => {
    return Promise.all(links.requiresMoreParsing.map(frame => processPage(frame))).then(
      framesResults => {
        const aggUrls = framesResults.reduce(
          (urls, frame) => (urls = urls.concat(frame.resourceUrls)),
          links.externalUrls,
        );

        const aggBlobs = framesResults.reduce(
          (blobAgg, frame) => (blobAgg = blobAgg.concat(frame.blobs)),
          blobs,
        );

        const allFrames = framesResults
          .reduce(
            (framesAgg, frame) => framesAgg.concat(frame.frames),
            framesResults.map(f => ({cdt: f.cdt, url: f.url})),
          )
          .map(f => ({
            cdt: f.cdt,
            url: f.url,
          }));

        return {
          cdt: domNodesToCdt(doc),
          url: doc.defaultView.location.href,
          resourceUrls: uniq(aggUrls),
          blobs: uniq(aggBlobs),
          frames: uniq(allFrames),
        };
      },
    );
  });
}

const processResources = new Function(
  'doc',
  '{\n' +
    isSameOrigin.toString() +
    '\n' +
    uniq.toString() +
    '\n' +
    splitOnOrigin.toString() +
    '\n' +
    extractLinks.toString() +
    '\n' +
    fetchLocalResources.toString() +
    '\n' +
    processPage.toString() +
    '\n' +
    domNodesToCdt.toString() +
    '\nreturn processPage(doc);\n' +
    '\n}',
);

module.exports = {
  uniq,
  isSameOrigin,
  splitOnOrigin,
  extractLinks,
  processPage,
  fetchLocalResources,
  processResources,
};
