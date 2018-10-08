'use strict';
const {describe, it, before, after} = require('mocha');
const {expect} = require('chai');
const testLogger = require('../../util/testLogger');
const makeExtractCssResourcesFromCdt = require('../../../src/sdk/extractCssResourcesFromCdt');
const makeExtractCssResources = require('../../../src/sdk/extractCssResources');
const testServer = require('../../util/testServer');
const createResourceCache = require('../../../src/sdk/createResourceCache');

const makeCheckWindow = require('../../../src/sdk/checkWindow');
const makeGetAllResources = require('../../../src/sdk/getAllResources');
const makeFetchResource = require('../../../src/sdk/fetchResource');
const {processDocument} = require('../../../src/browser-util/processResources');
const puppeteer = require('puppeteer');

describe('checkWindow', () => {
  let server, baseUrl;
  let browser;

  before(async () => {
    server = await testServer();
    baseUrl = `http://localhost:${server.port}`;
    browser = await puppeteer.launch();
  });

  after(async () => {
    await server.close();
    await browser.close();
  });

  it('works', async () => {
    const page = await browser.newPage();

    await page.goto(`${baseUrl}/iframes/frame.html`);

    const serialize = ({resourceUrls, blobs, frames, url, cdt, allBlobs}) => {
      function frameSerialize({resourceUrls, blobs, frames, url, cdt, allBlobs}) {
        //eslint-disable-next-line
        const decoder = new TextDecoder('utf-8');
        return {
          frames,
          url,
          cdt,
          resourceUrls,
          allBlobs: allBlobs.map(({url, type, value}) => ({
            url,
            type,
            value: decoder.decode(value),
          })),
          blobs: blobs.map(({url, type, value}) => ({
            url,
            type,
            value: decoder.decode(value),
          })),
        };
      }

      //eslint-disable-next-line
      const decoder = new TextDecoder('utf-8');
      return {
        frames: frames.map(frameSerialize),
        url,
        cdt,
        resourceUrls,
        allBlobs: allBlobs.map(({url, type, value}) => ({
          url,
          type,
          value: decoder.decode(value),
        })),
        blobs: blobs.map(({url, type, value}) => ({
          url,
          type,
          value: decoder.decode(value),
        })),
      };
    };

    const extractResources = new Function(
      `return (${processDocument})(document).then(${serialize})`,
    );
    const doc = await page.evaluate(extractResources);
    const res = await makeCheckWindow({
      getError: () => false,
      logger: testLogger,
      extractCssResourcesFromCdt: makeExtractCssResourcesFromCdt(makeExtractCssResources()),
      getAllResources: makeGetAllResources({
        resourceCache: createResourceCache(),
        extractCssResources: makeExtractCssResources(),
        fetchResource: makeFetchResource(testLogger),
      }),
      browsers: [],
      setCheckWindowPromises: x => x,
    })({
      cdt: doc.cdt,
      resourceUrls: doc.resourceurls,
      resouceContents: doc.blobs.map(b => ({[b.url]: b})).reduce((a, b) => (a[b.url] = b), {}),
      url: `${baseUrl}/iframes/frame.html`,
      frames: doc.frames.map(f => ({
        url: f.url,
        cdt: f.cdt,
        resourceUrls: f.resourceUrls,
        frames: f.frames,
        resourceContents: f.blobs.map(b => ({[b.url]: b})).reduce((a, b) => (a[b.url] = b), {}),
      })),
    });

    expect(JSON.stringify(res)).to.be.undefined;
  });
});
