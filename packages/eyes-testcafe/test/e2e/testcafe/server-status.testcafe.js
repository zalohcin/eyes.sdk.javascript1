/* global fixture */

'use strict'

const {Selector} = require('testcafe')
const {GeneralUtils} = require('@applitools/eyes-common')
const {presult} = require('@applitools/functional-commons')
const {Eyes, Target, ConsoleLogHandler} = require('../../..')
const {RectangleSize, NewTestError, DiffsFoundError, TestResults} = require('../../../index')

fixture`Server status`.page`https://applitools.com/helloworld`.before(async ctx => {
  ctx.eyes = new Eyes()
  if (process.env.APPLITOOLS_SHOW_LOGS || process.env.APPLITOOLS_DEBUG_TEST) {
    ctx.eyes.setLogHandler(new ConsoleLogHandler(true))
  }
  ctx.viewportSize = new RectangleSize(800, 600)
  ctx.testName = `TestSessionSummary_${GeneralUtils.guid()}`
  ctx.appName = 'Server Status'
})

test('TestSessionSummary_Status_New', async t => {
  const {eyes, testName, viewportSize, appName} = t.fixtureCtx
  eyes.setSaveNewTests(false)
  await eyes.open(t, appName, testName, viewportSize)
  await eyes.check('A new window', Target.window())
  const [err] = await presult(eyes.close())
  await t.expect(err instanceof NewTestError).ok('Expected NewTestError')
})

test('TestSessionSummary_Status_Passed', async t => {
  const {eyes, testName, viewportSize, appName} = t.fixtureCtx
  eyes.setSaveNewTests(true)
  await eyes.open(t, appName, testName, viewportSize)
  await eyes.check('A window', Target.window())
  const results = await eyes.close()
  await t.expect(results instanceof TestResults).ok()
  await t.expect(results.getIsNew()).ok()
})

test('TestSessionSummary_Status_Failed', async t => {
  const {eyes, testName, viewportSize, appName} = t.fixtureCtx
  await eyes.open(t, appName, testName, viewportSize)

  const button = Selector('button')
  await t.click(button)

  await eyes.check('A window', Target.window())
  const [err] = await presult(eyes.close())
  await t.expect(err instanceof DiffsFoundError).ok('Expected DiffsFoundError')
})
