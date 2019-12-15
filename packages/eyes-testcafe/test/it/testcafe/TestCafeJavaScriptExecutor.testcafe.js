/* global fixture */

'use strict'

const {Selector} = require('testcafe')
const {TestCafeJavaScriptExecutor} = require('../../../')

fixture`TestCafeJavaScriptExecutor fixture`.page`http://localhost:5555` // eslint-disable-line no-unused-expressions

test('run simple JavaScript in browser', async t => {
  const executor = new TestCafeJavaScriptExecutor(t)
  const value = await executor.executeScript('return 4')
  await t.expect(value).eql(4)
})

test('run JavaScript with arguments', async t => {
  const executor = new TestCafeJavaScriptExecutor(t)
  const value = await executor.executeScript('return arguments[0] + arguments[1]', 4, 5)
  await t.expect(value).eql(4 + 5)
})

test('run JavaScript with Selector argument', async t => {
  const executor = new TestCafeJavaScriptExecutor(t)
  const selector = Selector('html')
  const value = await executor.executeScript(
    "return getComputedStyle(arguments[0]).getPropertyValue('overflow')",
    selector,
  )
  await t.expect(value).eql('visible')
})

test('run JavaScript with DOM node snapshot argument', async t => {
  const executor = new TestCafeJavaScriptExecutor(t)
  const elSnapshot = await Selector('html')()
  const value = await executor.executeScript("return arguments[0].style['overflow-y']", elSnapshot)
  await t.expect(value).eql('visible')
})
