'use strict';

const puppeteer = require('puppeteer');
const {makeVisualGridClient} = require('../src/visual-grid-client');
const {getProcessPageAndSerializeScript} = require('@applitools/dom-capture');
const testServer = require('../test/util/testServer');

(async function() {
  const server = await testServer({port: 7373});
  const {openEyes} = makeVisualGridClient({
    apiKey: process.env.APPLITOOLS_API_KEY,
    showLogs: process.env.APPLITOOLS_SHOW_LOGS,
    // proxy: 'http://localhost:8888',
  });

  const {checkWindow, close} = await openEyes({
    appName: 'render script',
    testName: 'render script',
    browser: {deviceName: 'iPhone X'},
  });

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const processPageAndSerialize = `(${await getProcessPageAndSerializeScript()})()`;

  await page.setCookie({name: 'auth', value: 'secret', url: 'http://localhost:7373/test.html'});
  await page.goto('http://localhost:7373/test.html');

  const {cdt, url, resourceUrls, blobs, frames} = await page.evaluate(processPageAndSerialize);
  const resourceContents = blobs.map(({url, type, value}) => ({
    url,
    type,
    value: Buffer.from(value, 'base64'),
  }));

  checkWindow({url, cdt, resourceUrls, resourceContents, frames});
  const result = await close(false);
  console.log(`${result}`);
  await browser.close();
  await server.close();
})();
