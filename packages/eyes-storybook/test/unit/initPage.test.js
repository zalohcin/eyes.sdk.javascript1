'use strict';

const {describe, it, before, after} = require('mocha');
const {expect} = require('chai');
const puppeteer = require('puppeteer');
const makeInitPage = require('../../src/initPage');
const logger = require('../util/testLogger');

describe('init page', () => {
  let browser;

  before(async () => {
    browser = await puppeteer.launch();
  });

  after(async () => {
    browser.close();
  });

  it('set configurations', async () => {
    const iframeUrl = 'about:blank';
    const config = {
      viewportSize: {width: 400, height: 600},
    };
    const initPage = makeInitPage({iframeUrl, config, browser, logger});

    const page = await initPage({pageId: 0});

    expect(page.viewport()).to.eql(config.viewportSize);
    expect(page.url()).to.eql(iframeUrl);
  });
});
