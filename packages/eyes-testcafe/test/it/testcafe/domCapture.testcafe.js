/* global fixture */

'use strict'

const captureFrameAndPoll = require('../../../dist/captureFrameAndPoll')
const captureFrameAndPollForIE = require('../../../dist/captureFrameAndPollForIE')
const {TestCafeJavaScriptExecutor} = require('../../../lib/TestCafeJavaScriptExecutor')
const {loadFixture} = require('../../util/loadFixture')

fixture`Dom capture`.page`http://localhost:5555`

test('Dom capture', async t => {
  const ex = new TestCafeJavaScriptExecutor(t)
  let result = await ex.executeScript(captureFrameAndPoll)
  result = JSON.parse(result)
  await t.expect(result).eql({status: 'WIP', value: null, error: null})

  result = await ex.executeScript(captureFrameAndPoll)
  result = replaceProxyGuid(result)

  let expected = await loadFixture('dom-capture.text')
  expected = replaceProxyGuid(expected)
  await t.expect(result).eql(expected)
})

// FIX IE
test.skip('Dom capture IE', async t => {
  const ex = new TestCafeJavaScriptExecutor(t)
  let result = await ex.executeScript(captureFrameAndPoll)
  result = JSON.parse(result)
  await t.expect(result).eql({status: 'WIP', value: null, error: null})

  result = await ex.executeScript(captureFrameAndPollForIE)
  result = replaceProxyGuid(result)

  let expected = await loadFixture('dom-capture.text')
  expected = replaceProxyGuid(expected)
  await t.expect(result).eql(expected)
})

function replaceProxyGuid(str) {
  return str.replace(/(https?:\/\/\d+\.\d+\.\d+\.\d+:\d+\/)(.+)(https:)/, '$1PROXY_GUID/$3')
}
