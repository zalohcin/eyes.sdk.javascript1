'use strict';

const puppeteer = require('puppeteer');
const {makeVisualGridClient} = require('../src/visual-grid-client');
const {getProcessPageAndSerializeScript} = require('@applitools/dom-snapshot');
const testServer = require('../test/util/testServer');
const debug = require('debug')('render');

(async function() {
  const website = process.argv[2];

  if (!website) {
    console.log('no website passed');
    return;
  }

  console.log('checking website:', website);

  const server = await testServer({port: 7373});
  const {openEyes} = makeVisualGridClient({
    apiKey: process.env.APPLITOOLS_API_KEY,
    showLogs: process.env.APPLITOOLS_SHOW_LOGS,
    proxy: process.env.APPLITOOLS_PROXY, // 'http://localhost:8888',
  });

  const {checkWindow, close} = await openEyes({
    appName: 'render script',
    testName: 'render script',
    browser: [{deviceName: 'iPhone X'}, {width: 320, height: 480}],
  });

  debug('open done');

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const processPageAndSerialize = `(${await getProcessPageAndSerializeScript()})()`;

  await page.setCookie({name: 'auth', value: 'secret', url: 'http://localhost:7373/test.html'});
  await page.goto(website);

  debug('navigation done');

  const {cdt, url, resourceUrls, blobs, frames} = await page.evaluate(processPageAndSerialize);

  debug('processPage done');
  const resourceContents = blobs.map(({url, type, value}) => ({
    url,
    type,
    value: Buffer.from(value, 'base64'),
  }));
  debug('decoding done');

  checkWindow({url, cdt, resourceUrls, resourceContents, frames});
  const results = await close().catch(err => err);
  if (results instanceof Error) {
    console.log('error!', results);
  } else {
    console.log(
      `Test result:\n\t${results.map(r => `${r.getStatus()} ${r.getUrl()}`).join('\n\t')}`,
    );
  }
  await browser.close();
  await server.close();
  debug('browser closed');
})();
