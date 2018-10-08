'use strict';
const {describe, it, before, after} = require('mocha');
const {expect} = require('chai');
const {JSDOM} = require('jsdom');
const makeCreateRGridDOMAndGetResourceMapping = require('../../../src/sdk/createRGridDOMAndGetResourceMapping');
const makeGetAllResources = require('../../../src/sdk/getAllResources');
const createResourceCache = require('../../../src/sdk/createResourceCache');
const makeExtractCssResourcesFromCdt = require('../../../src/sdk/extractCssResourcesFromCdt');
const makeParseInlineCssFromCdt = require('../../../src/sdk/parseInlineCssFromCdt');
const domNodesToCdt = require('../../../src/browser-util/domNodesToCdt');
const makeExtractCssResources = require('../../../src/sdk/extractCssResources');
const makeFetchResource = require('../../../src/sdk/fetchResource');
const testLogger = require('../../util/testLogger');
const testServer = require('../../util/testServer');
const {loadJsonFixture} = require('../../util/loadFixture');

describe('createRGridDOMAndGetResourceMapping', () => {
  let server;
  let baseUrl;
  before(async () => {
    server = await testServer();
    baseUrl = `http://localhost:${server.port}`;
  });
  after(async () => {
    await server.close();
  });

  it('works', async () => {
    const fut = makeCreateRGridDOMAndGetResourceMapping(
      makeGetAllResources({
        resourceCache: createResourceCache(),
        extractCssResources: makeExtractCssResources(testLogger),
        fetchResource: makeFetchResource(testLogger),
        fetchCache: createResourceCache(),
      }),
      makeParseInlineCssFromCdt(
        makeExtractCssResourcesFromCdt(makeExtractCssResources(testLogger)),
      ),
    );
    const resourceUrls = ['smurfs.jpg', 'test.css'];
    const cdt = loadJsonFixture('test.cdt.json');

    const res = await fut({
      url: `${baseUrl}/iframes/frame.html`,
      cdt: loadJsonFixture('inner-frame.cdt.json'),
      resourceUrls,
      resourceContents: {},
      frames: [
        {
          url: `${baseUrl}/test.html`,
          cdt,
          resourceUrls,
          resourceContents: {},
          frames: [],
        },
        {
          url: `${baseUrl}/iframes/inner/test.html`,
          cdt: domNodesToCdt(
            (await JSDOM.fromURL(`${baseUrl}/iframes/inner/test.html`, {resources: 'usable'}))
              .window.document,
          ),
          resourceUrls,
          resourceContents: {},
          frames: [],
        },
      ],
    });
    expect(Object.keys(res.allResources).filter(url => url.endsWith('.html'))).to.not.be.empty;
  });
});
