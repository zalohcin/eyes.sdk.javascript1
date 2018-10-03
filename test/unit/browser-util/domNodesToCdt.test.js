'use strict';
const {describe, it} = require('mocha');
const {expect} = require('chai');
const {JSDOM} = require('jsdom');
const puppeteer = require('puppeteer');
const testServer = require('../../util/testServer');
const domNodesToCdt = require('../../../src/browser-util/domNodesToCdt');
const {NODE_TYPES} = domNodesToCdt;
const {loadFixture, loadJsonFixture} = require('../../util/loadFixture');
const fs = require('fs');
const {resolve} = require('path');

function getDocNode(htmlStr) {
  const dom = new JSDOM(htmlStr, {url: 'http://something.org/'});
  return dom.window.document;
}

const domNodesToCdtInPuppeteer = new Function(`return (${domNodesToCdt})(document)`);

describe('domNodesToCdt', () => {
  it('works for DOM with 1 element', () => {
    const docNode = getDocNode('<div style="color:red;">hello</div>');
    const cdt = domNodesToCdt(docNode);
    const expected = [
      {
        nodeType: NODE_TYPES.DOCUMENT,
        childNodeIndexes: [5],
      },
      {
        nodeType: NODE_TYPES.ELEMENT,
        nodeName: 'HEAD',
        attributes: [],
        childNodeIndexes: [],
      },
      {
        nodeType: NODE_TYPES.TEXT,
        nodeValue: 'hello',
      },
      {
        nodeType: NODE_TYPES.ELEMENT,
        nodeName: 'DIV',
        childNodeIndexes: [2],
        attributes: [{name: 'style', value: 'color:red;'}],
      },
      {
        nodeType: NODE_TYPES.ELEMENT,
        nodeName: 'BODY',
        childNodeIndexes: [3],
        attributes: [],
      },
      {
        nodeType: NODE_TYPES.ELEMENT,
        nodeName: 'HTML',
        attributes: [],
        childNodeIndexes: [1, 4],
      },
    ];
    expect(cdt).to.deep.equal(expected);
  });

  it('works for test.html', () => {
    const docNode = getDocNode(loadFixture('test.html'));
    const cdt = domNodesToCdt(docNode);
    if (process.env.APPLITOOLS_UPDATE_FIXTURES) {
      const cdtStr = JSON.stringify(cdt, null, 2);
      fs.writeFileSync(resolve(__dirname, '../../fixtures/test.orig.cdt.json'), cdtStr);
    }
    const expectedCdt = loadJsonFixture('test.orig.cdt.json');
    expect(cdt).to.deep.equal(expectedCdt);
  });

  it('handles empty style tags with CSSOM content', async () => {
    const server = await testServer();
    const browser = await puppeteer.launch();
    try {
      const page = await browser.newPage();
      const url = `http://localhost:${server.port}/cssom.html`;

      await page.goto(url);

      const cdt = await page.evaluate(domNodesToCdtInPuppeteer);

      if (process.env.APPLITOOLS_UPDATE_FIXTURES) {
        const cdtStr = JSON.stringify(cdt, null, 2);
        fs.writeFileSync(resolve(__dirname, '../../fixtures/cssom.cdt.json'), cdtStr);
      }

      const expectedCdt = loadJsonFixture('cssom.cdt.json');
      expect(cdt).to.eql(expectedCdt);
    } finally {
      await browser.close();
      await server.close();
    }
  });

  //this is for generating the cdt files
  it.skip('works for test-iframe.html', () => {
    const docNode = getDocNode(loadFixture('test-iframe.html'));
    const cdt = domNodesToCdt(docNode);
    const iframeDocNode = getDocNode(loadFixture('inner-frame.html'));
    const iframeCdt = domNodesToCdt(iframeDocNode);

    const expectedCdt = loadJsonFixture('test-iframe.cdt.json');
    const expectedFrameCdt = loadJsonFixture('inner-frame.cdt.json');
    expect(cdt).to.deep.equal(expectedCdt);
    expect(iframeCdt).to.deep.equal(expectedFrameCdt);
  });
});
