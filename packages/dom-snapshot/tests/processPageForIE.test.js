'use strict';

const {describe, it, before} = require('mocha');
const {expect} = require('chai');
const {getProcessPageAndSerializeForIE, getProcessPageAndSerializePollForIE} = require('../index');
const {loadJsonFixture} = require('./util/loadFixture');
const fs = require('fs');
const path = require('path');
const {Builder} = require('selenium-webdriver');
const ie = require('selenium-webdriver/ie');
const {version} = require('../package.json');

function executeAsyncScript(driver, func) {
  const script = `
var callback = arguments[arguments.length-1];
(${func})().then(callback, function(err) {callback(err.message);});
setTimeout(function(){},0);
`;
  return driver.executeAsyncScript(script);
}

describe('processPage for IE', () => {
  let processPage;
  let processPageSerializePoll;

  before(async () => {
    const _processPageAndSerialize = await getProcessPageAndSerializeForIE();
    processPage = driver =>
      executeAsyncScript(driver, _processPageAndSerialize).then(result => {
        if (typeof result === 'string') {
          throw new Error(result);
        } else {
          return result;
        }
      });
    processPageSerializePoll = await getProcessPageAndSerializePollForIE();
  });

  function saveFixture(name, content) {
    fs.writeFileSync(path.resolve(__dirname, `fixtures/${name}`), JSON.stringify(content, null, 2));
  }

  async function buildDriver({browserName, serverIP}) {
    const driver = new Builder()
      .forBrowser(browserName)
      .setIeOptions(new ie.Options().addArguments('-k', '-private'))
      .usingServer(`http://${serverIP}:4444/wd/hub`)
      .build();

    await driver.manage().setTimeouts({script: 10000});
    return driver;
  }

  it('works in Edge', async () => {
    const driver = await buildDriver({
      browserName: 'MicrosoftEdge',
      serverIP: process.env.SELENIUM_VM_IP,
    });
    try {
      const fixtureName = 'edge.cdt.json';
      const url = 'http://applitools-dom-snapshot.surge.sh/ie';
      await driver.get(url);

      const result = await processPage(driver);

      if (process.env.APPLITOOLS_UPDATE_FIXTURES) {
        saveFixture(fixtureName, result);
      }

      const {cdt, resourceUrls, blobs, srcAttr, frames} = loadJsonFixture(fixtureName);

      // the following assertions are here so that the mocha doesn't get stuck if the test fails on big blobs
      expect(result.cdt).to.eql(cdt);
      expect(result.resourceUrls).to.eql(resourceUrls);
      expect(result.blobs.map(b => b.url)).to.eql(blobs.map(b => b.url));

      expect(result).to.eql({
        blobs,
        cdt,
        frames,
        resourceUrls,
        url,
        srcAttr,
        scriptVersion: version,
      });
    } finally {
      await driver.quit();
    }
  });

  it('works in IE 11', async () => {
    const driver = await buildDriver({
      browserName: 'internet explorer',
      serverIP: process.env.SELENIUM_VM_IP,
    });
    try {
      const fixtureName = 'ie11.cdt.json';
      const url = 'http://applitools-dom-snapshot.surge.sh/ie';
      await driver.get(url);

      const result = await processPage(driver);

      if (process.env.APPLITOOLS_UPDATE_FIXTURES) {
        saveFixture(fixtureName, result);
      }

      const {cdt, resourceUrls, blobs, srcAttr, frames} = loadJsonFixture(fixtureName);

      // the following assertions are here so that the mocha doesn't get stuck if the test fails on big blobs
      expect(result.cdt).to.eql(cdt);
      expect(result.resourceUrls).to.eql(resourceUrls);
      expect(result.blobs.map(b => b.url)).to.eql(blobs.map(b => b.url));

      expect(result).to.eql({
        blobs,
        cdt,
        frames,
        resourceUrls,
        url,
        srcAttr,
        scriptVersion: version,
      });
    } finally {
      await driver.quit();
    }
  });

  it('works in IE 10', async () => {
    const driver = await buildDriver({
      browserName: 'internet explorer',
      serverIP: process.env.SELENIUM_VM_IP_IE10,
    });
    try {
      const fixtureName = 'ie10.cdt.json';
      const url = 'http://applitools-dom-snapshot.surge.sh/ie';
      await driver.get(url);

      const result = await processPage(driver);

      if (process.env.APPLITOOLS_UPDATE_FIXTURES) {
        saveFixture(fixtureName, result);
      }

      const {cdt, resourceUrls, blobs, srcAttr, frames} = loadJsonFixture(fixtureName);

      // the following assertions are here so that the mocha doesn't get stuck if the test fails on big blobs
      expect(result.cdt).to.eql(cdt);
      expect(result.resourceUrls).to.eql(resourceUrls);
      expect(result.blobs.map(b => b.url)).to.eql(blobs.map(b => b.url));

      expect(result).to.eql({
        blobs,
        cdt,
        frames,
        resourceUrls,
        url,
        srcAttr,
        scriptVersion: version,
      });
    } finally {
      await driver.quit();
    }
  });

  it('poll works in IE 10', async () => {
    const driver = await buildDriver({
      browserName: 'internet explorer',
      serverIP: process.env.SELENIUM_VM_IP_IE10,
    });
    try {
      const url = 'http://applitools-dom-snapshot.surge.sh/ie';
      await driver.get(url);
      const result = await driver.executeScript(`return (${processPageSerializePoll})()`);
      expect(JSON.parse(result)).to.eql({status: 'WIP', value: null, error: null});
    } finally {
      await driver.quit();
    }
  });
});
