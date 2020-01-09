/* global fixture */

'use strict'

const {Selector} = require('testcafe')
const {EyesTestcafeUtils} = require('../../../lib/EyesTestcafeUtils')
const {EyesWebDriver} = require('../../../lib/wrappers/EyesWebDriver')
const {TestCafeExecutor} = require('../../../lib/TestCafeExecutor')
fixture`EyesJsBrowserUtils fixture`.page`http://localhost:5555`

test('setOverflow with Selector', async t => {
  const el = Selector('html')
  const executor = new TestCafeExecutor(t)
  const origValue = await EyesTestcafeUtils.setOverflow(executor, 'hidden', el)
  await t.expect(origValue).eql('')
  const newValue = await executor.executeScript('return arguments[0].style["overflow-y"]', el)
  await t.expect(newValue).eql('hidden')
  const newAttr = await executor.executeScript(
    'return arguments[0].getAttribute("data-applitools-original-overflow")',
    el,
  )
  await t.expect(newAttr).eql('')
})

test('setOverflow with EyesWebElementPromise', async t => {
  const eyes = {}
  const logger = {}
  const driver = new EyesWebDriver(logger, eyes, t)
  const el = driver.findElement('html')
  const executor = new TestCafeExecutor(t)
  const origValue = await EyesTestcafeUtils.setOverflow(executor, 'hidden', el)
  await t.expect(origValue).eql('')
  const newValue = await executor.executeScript('return arguments[0].style["overflow-y"]', el)
  await t.expect(newValue).eql('hidden')
  const newAttr = await executor.executeScript(
    'return arguments[0].getAttribute("data-applitools-original-overflow")',
    el,
  )
  await t.expect(newAttr).eql('')
})
