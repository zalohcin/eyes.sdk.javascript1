'use strict';
const {describe, it, before, after, beforeEach, afterEach} = require('mocha');
const {expect} = require('chai');
const puppeteer = require('puppeteer');
const {URL} = require('url');
const {JSDOM} = require('jsdom');
const fetch = require('node-fetch');
const {
  extractLinks,
  isSameOrigin,
  splitOnOrigin,
  processResources,
  uniq,
} = require('../../../src/browser-util/processResources');
const testServer = require('../../util/testServer');

describe('processResources', () => {
  global.fetch = fetch;
  it('extracts external Urls', async () => {
    const dom = new JSDOM('<html><body><img src="https://www.google.com/cat.jpg"/></body></html>', {
      beforeParse(window) {
        window.fetch = str => {
          return Promise.resolve(str);
        };
        window.document.defaultView.fetch = str => {
          return Promise.resolve(str);
        };
      },
      runScripts: 'dangerously',
      url: new URL('http://www.applitools.com/temp'),
    });

    const retVal = await dom.window.eval(`(${processResources})(document)`);
    expect(retVal.resourceUrls).to.deep.equal(['https://www.google.com/cat.jpg']);
  });

  describe('iframe processing', () => {
    let server;
    let baseUrl;
    let closeServer;
    let browser;
    let page;

    before(async () => {
      server = await testServer();
      baseUrl = `http://localhost:${server.port}`;
      closeServer = server.close;
    });

    after(async () => {
      await closeServer();
    });

    beforeEach(async () => {
      browser = await puppeteer.launch();
      page = await browser.newPage();
    });

    afterEach(async () => {
      await browser.close();
    });

    it('extracts external Urls from frames', async () => {
      await page.goto(`${baseUrl}/test-iframe.html`);
      const retVal = await page.evaluate(`(${processResources})(document)`);

      expect(retVal.resourceUrls).to.be.any;
    });
  });
});

describe('processResources', () => {
  let browser, page;
  const origin = 'http://www.example.com';
  before(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    page.on('console', msg => {
      for (let i = 0; i < msg.args.length; ++i) console.log(`${i}: ${msg.args[i]}`);
    });
    await page.goto(origin);
  });

  after(async () => {
    await browser.close();
  });

  describe('isSameOrigin', () => {
    it('marks local url as same origin', async () => {
      const dom = new JSDOM('<html><body><img src="cat.jpg"/></body></html>', {
        runScripts: 'outside-only',
        url: new URL('http://www.applitools.com/temp'),
      });
      const retVal = dom.window.eval(
        `(${isSameOrigin.toString()})(window.location,document.getElementsByTagName('img')[0].src)`,
      );
      expect(retVal).to.be.true;
    });

    it('marks external urls as different origin', async () => {
      const dom = new JSDOM(
        '<html><body><img src="http://www.google.com/cat.jpg"/></body></html>',
        {
          beforeParse(window) {
            window.URL = URL;
          },
          runScripts: 'dangerously',
          url: new URL('http://www.applitools.com/temp'),
        },
      );

      const retVal = dom.window.eval(
        `(${isSameOrigin.toString()})(window.location,document.getElementsByTagName('img')[0].src)`,
      );
      expect(retVal).to.be.false;
    });

    it('marks blob urls as same origin', async () => {
      await page.setContent(
        '<html><body><img src="blob:http://www.google.com/cat.jpg"/></body></html>',
      );

      const retVal = await page.evaluate(
        `(${isSameOrigin.toString()})(window.location,document.getElementsByTagName('img')[0].src)`,
      );
      expect(retVal).to.be.true;
    });
  });

  describe('splitOnOrigin', () => {
    it('should find external URLs', async () => {
      const dom = new JSDOM(
        `<html><body>
      <img src="blob:http://www.google.com/cat.jpg"/>
      <img src="http://www.google.com/body.jpg"/>
      </body></html>`,
        {
          runScripts: 'outside-only',
          url: new URL('http://www.applitools.com/temp'),
        },
      );

      const result = dom.window.eval(
        splitOnOrigin(
          dom.window.location,
          Array.from(dom.window.document.getElementsByTagName('img')).map(img => img.src),
        ),
      );

      expect(result.externalUrls).to.include('http://www.google.com/body.jpg');
      expect(result.internalUrls).to.include('blob:http://www.google.com/cat.jpg');
    });
  });

  describe('extractLinks', () => {
    const wrapper = new Function(
      'document',
      '{' +
        uniq.toString() +
        '\n' +
        isSameOrigin.toString() +
        '\n' +
        splitOnOrigin.toString() +
        '\n' +
        extractLinks.toString() +
        '\n' +
        '}\nreturn extractLinks(document)',
    );

    it('gets image links', async () => {
      await page.setContent(
        `<html><body>
                <img src="blob:http://www.google.com/cat.jpg"/>
                <img src="http://www.google.com/body.jpg"/>
                </body></html>`,
      );
      const result = await page.evaluate(`(${wrapper.toString()})(document)`);
      expect(result.externalUrls).to.include('http://www.google.com/body.jpg');
    });

    it('gets iframe links', async () => {
      const server = await testServer();
      try {
        const baseUrl = `http://localhost:${server.port}`;
        await page.goto(`${baseUrl}/inner-frame.html`);

        const result = await page.evaluate(`(${wrapper.toString()})(document)`);

        expect(result.requiresMoreParsing.length).to.equal(2);
      } finally {
        await server.close();
      }
    });
  });
});
