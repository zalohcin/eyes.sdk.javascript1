'use strict';
const {describe, it, beforeEach} = require('mocha');
const {expect} = require('chai');
const createResourceCache = require('../../../src/sdk/createResourceCache');
const {NODE_TYPES} = require('../../../src/browser-util/domNodesToCdt');
const makeGetBundledCssFromCdt = require('../../../src/sdk/getBundledCssFromCdt');
const testLogger = require('../../util/testLogger');
const {loadJsonFixture, loadFixture} = require('../../util/loadFixture');
const {getCss} = makeGetBundledCssFromCdt;

describe('getBundledCssFromCdt', () => {
  let getBundledCssFromCdt, resourceCache;
  beforeEach(() => {
    resourceCache = createResourceCache();
    getBundledCssFromCdt = makeGetBundledCssFromCdt({
      resourceCache,
      logger: testLogger,
    });
  });

  it('bundles relative urls in link tags', () => {
    const baseUrl = 'http://some.url';
    const testCss = '.kuku { color: fuchsia; }';
    const url = `${baseUrl}/test.css`;
    const cdt = [
      {nodeName: 'head', childNodeIndexes: [1]},
      {
        nodeName: 'link',
        attributes: [{name: 'rel', value: 'stylesheet'}, {name: 'href', value: 'test.css'}],
      },
    ];
    resourceCache.setValue(url, {url, type: 'text/css', content: testCss});
    const bundledCss = getBundledCssFromCdt(cdt, baseUrl);
    expect(bundledCss).to.equal(getCss(testCss, url));
  });

  it('bundles content of style tags', () => {
    const styleCss = '.bla { display: inline; }';
    const cdt = [
      {nodeName: 'head', childNodeIndexes: [1]},
      {nodeName: 'style', childNodeIndexes: [2]},
      {nodeType: NODE_TYPES.TEXT, nodeValue: styleCss},
    ];
    const bundledCss = getBundledCssFromCdt(cdt, '');
    expect(bundledCss).to.equal(getCss(styleCss, ''));
  });

  it('bundles absolute urls in link tags', () => {
    const baseUrl = 'http://some.url';
    const testCss = '.kuku { color: fuchsia; }';
    const url = `${baseUrl}/test.css`;
    const cdt = [
      {nodeName: 'head', childNodeIndexes: [1]},
      {
        nodeName: 'link',
        attributes: [
          {name: 'rel', value: 'stylesheet'},
          {name: 'href', value: 'http://some.url/test.css'},
        ],
      },
    ];
    resourceCache.setValue(url, {url, type: 'text/css', content: testCss});
    const bundledCss = getBundledCssFromCdt(cdt, 'http://other'); // note baseUrl is other url, since the href is absolute so the baseUrl is not used
    expect(bundledCss).to.equal(getCss(testCss, url));
  });

  it('bundles nested content of style tags', () => {
    const baseUrl = 'http://some.url';
    const nestedName = 'nested.css';
    const nestedUrl = `${baseUrl}/nested.css`;
    const nestedValue = '.nested { color: salmon; }';
    const styleCss = `@import "${nestedName}"; .bla { display: inline; }`;
    const cdt = [
      {nodeName: 'head', childNodeIndexes: [1]},
      {nodeName: 'style', childNodeIndexes: [2]},
      {nodeType: NODE_TYPES.TEXT, nodeValue: styleCss},
    ];
    resourceCache.setValue(nestedUrl, {url: nestedUrl, type: 'text/css', content: nestedValue});
    const bundledCss = getBundledCssFromCdt(cdt, baseUrl);
    const expected = `${getCss(nestedValue, nestedUrl)}${getCss(styleCss, baseUrl)}`;
    expect(bundledCss).to.equal(expected);
  });

  it('bundles nested content of link tags', () => {
    const baseUrl = 'http://some.url';
    const nestedName = 'nested.css';
    const nestedUrl = `${baseUrl}/nested.css`;
    const nestedValue = '.nested { color: salmon; }';
    const testCss = `@import "${nestedName}"; .bla { display: inline; }`;
    const url = `${baseUrl}/test.css`;
    const cdt = [
      {nodeName: 'head', childNodeIndexes: [1]},
      {
        nodeName: 'link',
        attributes: [
          {name: 'rel', value: 'stylesheet'},
          {name: 'href', value: 'http://some.url/test.css'},
        ],
      },
    ];
    resourceCache.setValue(url, {url, type: 'text/css', content: testCss});
    resourceCache.setValue(nestedUrl, {url: nestedUrl, type: 'text/css', content: nestedValue});
    const bundledCss = getBundledCssFromCdt(cdt, 'http://other'); // note baseUrl is other url, since the href is absolute so the baseUrl is not used
    const expected = `${getCss(nestedValue, nestedUrl)}${getCss(testCss, url)}`;
    expect(bundledCss).to.equal(expected);
  });

  it('works for test.cdt.json', () => {
    const baseUrl = 'http://some.url';
    const type = 'text/css ;charset=utf-8';
    const testCssUrl = `${baseUrl}/test.css`;
    const testCssValue = loadFixture('test.css');
    const importedUrl = `${baseUrl}/imported.css`;
    const importedValue = loadFixture('imported.css');
    const imported2Url = `${baseUrl}/imported2.css`;
    const imported2Value = loadFixture('imported2.css');
    const importedNestedUrl = `${baseUrl}/imported-nested.css`;
    const importedNestedValue = loadFixture('imported-nested.css');
    const fontUrl = 'https://fonts.googleapis.com/css?family=Zilla+Slab';
    const fontValue = 'font';
    const blobUrl = `${baseUrl}/a-made-up-blob-url-1`;
    const blobValue = 'some value';

    resourceCache.setValue(testCssUrl, {
      url: testCssUrl,
      type,
      content: testCssValue,
    });
    resourceCache.setValue(importedUrl, {
      url: importedUrl,
      type,
      content: importedValue,
    });
    resourceCache.setValue(imported2Url, {
      url: imported2Url,
      type,
      content: imported2Value,
    });
    resourceCache.setValue(importedNestedUrl, {
      url: importedNestedUrl,
      type,
      content: importedNestedValue,
    });
    resourceCache.setValue(fontUrl, {
      url: fontUrl,
      type,
      content: fontValue,
    });
    resourceCache.setValue(blobUrl, {
      url: blobUrl,
      type,
      content: blobValue,
    });
    const bundledCss = getBundledCssFromCdt(loadJsonFixture('test.cdt.json'), baseUrl);

    let expected = `${getCss(importedNestedValue, importedNestedUrl)}${getCss(
      importedValue,
      importedUrl,
    )}${getCss(testCssValue, testCssUrl)}${getCss(imported2Value, imported2Url)}${getCss(
      "\n    @import 'imported2.css';\n  ",
      baseUrl,
    )}${getCss(fontValue, fontUrl)}${getCss(blobValue, blobUrl)}`;

    expect(bundledCss).to.equal(expected);
  });

  it('handles missing content in resource from cache', () => {
    const baseUrl = 'http://some.url';
    const url = `${baseUrl}/test.css`;
    const cdt = [
      {nodeName: 'head', childNodeIndexes: [1]},
      {
        nodeName: 'link',
        attributes: [{name: 'rel', value: 'stylesheet'}, {name: 'href', value: 'test.css'}],
      },
    ];
    resourceCache.setValue(url, {url, type: 'text/css'});
    const bundledCss = getBundledCssFromCdt(cdt, baseUrl);
    expect(bundledCss).to.equal('');
  });
});
