'use strict';
const {describe, it, before, after} = require('mocha');
const {expect} = require('chai');
const puppeteer = require('puppeteer');
const {processDocument} = require('../../../src/browser-util/processResources');
const testServer = require('../../util/testServer');
const {loadFixture} = require('../../util/loadFixture');

const serialize = ({resourceUrls, blobs}) => {
  //eslint-disable-next-line
  const decoder = new TextDecoder('utf-8');
  return {
    resourceUrls,
    blobs: blobs.map(({url, type, value}) => ({
      url,
      type,
      value: decoder.decode(value),
    })),
  };
};

const extractResources = new Function(`return (${processDocument})(document).then(${serialize})`);

describe('extractResources', () => {
  let browser, page;
  before(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });

  after(async () => {
    await browser.close();
  });

  it('works for img', async () => {
    const htmlStr = `<body>
        <div style="color:red;">hello</div><img src="https://is2-ssl.mzstatic.com/image/thumb/Video117/v4/15/c8/06/15c8063f-c4c7-c6dd-d531-5b2814ddc634/source/227x227bb.jpg">
    </body>`;

    await page.goto(`data:text/html,${htmlStr}`);

    const expected = [
      'https://is2-ssl.mzstatic.com/image/thumb/Video117/v4/15/c8/06/15c8063f-c4c7-c6dd-d531-5b2814ddc634/source/227x227bb.jpg',
    ];

    const {resourceUrls} = await page.evaluate(extractResources);
    expect(resourceUrls).to.deep.equal(expected);
  });

  it('works for css', async () => {
    const htmlStr = `<head>
      <link href="http://link/to/css" rel="stylesheet" />
    </head>
    <body>
      <div class='red'>hello</div>
    </body>`;
    const expected = ['http://link/to/css'];

    await page.goto(`data:text/html,${htmlStr}`);
    const {resourceUrls} = await page.evaluate(extractResources);
    expect(resourceUrls).to.deep.equal(expected);
  });

  it("doesn't send scripts", async () => {
    const htmlStr = `<head>
      <script>console.log('something that should not be included')</script>
      <script src="relative/path/to.js"/>
    </head>
    <body>
      <div class='red'>hello</div>
    </body>`;
    const expected = [];

    await page.goto(`data:text/html,${htmlStr}`);
    const {resourceUrls} = await page.evaluate(extractResources);
    expect(resourceUrls).to.deep.equal(expected);
  });

  it('works for video', async () => {
    const htmlStr = `
      <video poster="/path/to/poster.jpg">
        <source src="/path/to/video.mp4" type="video/mp4">
      </video>`;
    const expected = ['/path/to/video.mp4', '/path/to/poster.jpg'];
    await page.goto(`data:text/html,${htmlStr}`);
    const {resourceUrls} = await page.evaluate(extractResources);
    expect(resourceUrls).to.eql(expected);
  });

  it('works for blob urls', async () => {
    const server = await testServer();

    try {
      const baseUrl = `http://localhost:${server.port}`;
      await page.goto(`${baseUrl}/blob.html`, {waitUntil: ['load', 'networkidle0']});
      const blobUrl = await page.evaluate(() =>
        //eslint-disable-next-line
        document.getElementsByTagName('link')[0].getAttribute('href'),
      );

      // console.log('blob url is ', blobUrl);
      // page.on('console', msg => {
      //   for (let i = 0; i < msg.args().length; ++i) console.log(`${i}: ${msg.args()[i]}`);
      // });

      const {blobs} = await page.evaluate(extractResources);
      const shortenedBlobUrl = blobUrl.replace(/^blob:http:\/\/localhost:\d+\/(.+)/, '$1');
      expect(blobs).to.eql([
        {
          url: `${baseUrl}/${shortenedBlobUrl}`,
          type: 'text/css',
          value: loadFixture('blob.css'),
        },
      ]);
    } catch (ex) {
      throw ex;
    } finally {
      await server.close();
    }
  });

  it('extracts content from same-origin resources and only URLs from cross-origin resources', async () => {
    const server1 = await testServer({
      port: 8484,
      // showLog: true,
    });
    const server2 = await testServer({
      port: 8585,
      // showLog: true,
    });
    const baseUrl = `http://localhost:${server1.port}`;
    try {
      await page.goto(`${baseUrl}/cors.html`);
      const {resourceUrls, blobs} = await page.evaluate(extractResources);
      expect(resourceUrls).to.eql(['http://localhost:8585/blob.css']);
      expect(blobs).to.eql([
        {
          url: `${baseUrl}/imported2.css`,
          type: 'text/css; charset=UTF-8',
          value: loadFixture('imported2.css'),
        },
      ]);
    } finally {
      await server1.close();
      await server2.close();
    }
  });

  it('filters out empty urls', async () => {
    const htmlStr = `<div><img src=""><img src="aaa"></div>`;

    await page.goto(`data:text/html,${htmlStr}`);

    const expected = ['aaa'];

    const {resourceUrls} = await page.evaluate(extractResources);
    expect(resourceUrls).to.deep.equal(expected);
  });

  it('extracts images from srcset', async () => {
    const htmlStr = `
      <img srcset="smurfs.jpg 151w,gargamel.jpg 1154w"
        sizes="(max-width: 768px) 151px,750px"
        src="smurfs.jpg" alt="Smurfs on small screen, gargamel on large">`;

    await page.goto(`data:text/html,${htmlStr}`);

    const expected = ['smurfs.jpg', 'gargamel.jpg'];

    const {resourceUrls} = await page.evaluate(extractResources);
    expect(resourceUrls).to.deep.equal(expected);
  });

  it('extracts images from srcset as blobs', async () => {
    const server = await testServer({port: 7373});
    await page.goto(`http://localhost:7373/srcset.html`);
    try {
      const {blobs} = await page.evaluate(extractResources);
      expect(blobs).to.eql(
        ['smurfs.jpg', 'smurfs1.jpg', 'gargamel1.jpg', 'gargamel.jpg', 'smurfs2.jpg'].map(name => ({
          url: `http://localhost:7373/${name}`,
          type: 'image/jpeg',
          value: loadFixture(name),
        })),
      );
    } finally {
      await server.close();
    }
  });

  it('extracts images from srcset with spaces and new lines', async () => {
    const htmlStr = `
      <img srcset="   smurfs.jpg   151w,
                      gargamel.jpg 1154w
                      "
        sizes="(max-width: 768px) 151px,750px"
        src="smurfs.jpg" alt="Smurfs on small screen, gargamel on large">`;

    await page.goto(`data:text/html,${htmlStr}`);

    const expected = ['smurfs.jpg', 'gargamel.jpg'];

    const {resourceUrls} = await page.evaluate(extractResources);
    expect(resourceUrls).to.deep.equal(expected);
  });
});
