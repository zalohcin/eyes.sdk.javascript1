/* global fixture */

'use strict';

const { Selector } = require('testcafe');
const { EyesSeleniumUtils, TestCafeJavaScriptExecutor, EyesWebDriver } = require('../../../');

fixture`EyesJsBrowserUtils fixture`.page`http://localhost:5555`; // eslint-disable-line no-unused-expressions

test('setOverflow with Selector', async (t) => {
  const el = Selector('html');
  const executor = new TestCafeJavaScriptExecutor(t);
  const origValue = await EyesSeleniumUtils.setOverflow(executor, 'hidden', el);
  await t.expect(origValue).eql('');
  const newValue = await executor.executeScript('return arguments[0]().style["overflow-y"]', el);
  await t.expect(newValue).eql('hidden');
  const newAttr = await executor.executeScript('return arguments[0]().getAttribute("data-applitools-original-overflow")', el);
  await t.expect(newAttr).eql('');
});

test('setOverflow with EyesWebElementPromise', async (t) => {
  const eyes = {};
  const logger = {};
  const driver = new EyesWebDriver(logger, eyes, t);
  const el = driver.findElement('html');
  const executor = new TestCafeJavaScriptExecutor(t);
  const origValue = await EyesSeleniumUtils.setOverflow(executor, 'hidden', el);
  await t.expect(origValue).eql('');
  const newValue = await executor.executeScript('return arguments[0]().style["overflow-y"]', el);
  await t.expect(newValue).eql('hidden');
  const newAttr = await executor.executeScript('return arguments[0]().getAttribute("data-applitools-original-overflow")', el);
  await t.expect(newAttr).eql('');
});
