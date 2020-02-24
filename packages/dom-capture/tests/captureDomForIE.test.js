'use strict';
const {describe, it, before} = require('mocha');
const {expect} = require('chai');
const {getCaptureDomForIEScript, getCaptureDomAndPollForIE} = require('../');
const {loadFixture} = require('./util/loadFixture');
const {beautifyOutput} = require('./util/beautifyOutput');
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

describe('captureDom for IE', () => {
  let captureDom;
  let captureDomAndPoll;

  before(async () => {
    const _captureDom = await getCaptureDomForIEScript();
    captureDomAndPoll = await getCaptureDomAndPollForIE();
    captureDom = driver => executeAsyncScript(driver, _captureDom);
  });

  function saveFixture(name, content) {
    fs.writeFileSync(path.resolve(__dirname, `fixtures/${name}`), content);
  }

  async function buildDriver({browserName, serverIP}) {
    const driver = new Builder()
      .forBrowser(browserName)
      .setIeOptions(new ie.Options().addArguments('-k', '-private'))
      .usingServer(`http://${serverIP}:4444/wd/hub`)
      .build();

    await driver.manage().setTimeouts({script: 10000});
    await driver
      .manage()
      .window()
      .setRect({width: 800, height: 600});
    return driver;
  }

  it('works in Edge', async () => {
    const driver = await buildDriver({
      browserName: 'MicrosoftEdge',
      serverIP: process.env.SELENIUM_VM_IP,
    });
    try {
      const fixtureName = 'edge.dom.json';
      const url = 'http://applitools-dom-capture-origin-1.surge.sh/ie.html';
      await driver.get(url);

      const domStr = beautifyOutput(await captureDom(driver));

      if (process.env.APPLITOOLS_UPDATE_FIXTURES) {
        saveFixture(fixtureName, domStr);
      }

      const expected = loadFixture(fixtureName).replace(
        'DOM_CAPTURE_SCRIPT_VERSION_TO_BE_REPLACED',
        version,
      );

      expect(domStr).to.eql(expected);
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
      const fixtureName = 'ie11.dom.json';
      const url = 'http://applitools-dom-capture-origin-1.surge.sh/ie.html';
      await driver.get(url);

      const domStr = beautifyOutput(await captureDom(driver));

      if (process.env.APPLITOOLS_UPDATE_FIXTURES) {
        saveFixture(fixtureName, domStr);
      }

      const expected = loadFixture(fixtureName).replace(
        'DOM_CAPTURE_SCRIPT_VERSION_TO_BE_REPLACED',
        version,
      );

      expect(domStr).to.equal(expected);
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
      const fixtureName = 'ie10.dom.json';
      const url = 'http://applitools-dom-capture-origin-1.surge.sh/ie.html';
      await driver.get(url);

      const domStr = beautifyOutput(await captureDom(driver));

      if (process.env.APPLITOOLS_UPDATE_FIXTURES) {
        saveFixture(fixtureName, domStr);
      }

      const expected = loadFixture(fixtureName).replace(
        'DOM_CAPTURE_SCRIPT_VERSION_TO_BE_REPLACED',
        version,
      );

      expect(domStr).to.eql(expected);
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
      const url = 'http://applitools-dom-capture-origin-1.surge.sh/ie.html';
      await driver.get(url);
      const result = await driver.executeScript(`return (${captureDomAndPoll})()`);
      expect(JSON.parse(result)).to.eql({status: 'WIP', value: null, error: null});
    } finally {
      await driver.quit();
    }
  });
});
