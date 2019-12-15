/* global fixture */

'use strict'

const {Configuration, StitchMode} = require('@applitools/eyes-common')
const {Eyes, Target, ConsoleLogHandler} = require('../../../..')

fixture.only`Hello world full page edge`.page`https://www.applitools.com/helloworld` // eslint-disable-line no-unused-expressions

test('helloworld full page edg', async t => {
  const eyes = new Eyes()
  eyes.setConfiguration(new Configuration({viewportSize: {width: 600, height: 500}}))
  if (process.env.APPLITOOLS_SHOW_LOGS || process.env.APPLITOOLS_DEBUG_TEST) {
    eyes.setLogHandler(new ConsoleLogHandler(true))
  }
  await eyes.open(t, 'Applitools helloworld', 'eyes-testcafe e2e - fullpage')
  await eyes.check('some tag', Target.window().fully())
  await eyes.close()
})

test('full page css stiching edge', async t => {
  const eyes = new Eyes()
  eyes.setStitchMode(StitchMode.CSS)
  eyes.setConfiguration(new Configuration({viewportSize: {width: 600, height: 500}}))
  if (process.env.APPLITOOLS_SHOW_LOGS || process.env.APPLITOOLS_DEBUG_TEST) {
    eyes.setLogHandler(new ConsoleLogHandler(true))
  }
  await eyes.open(t, 'Applitools helloworld', 'eyes-testcafe e2e - fullpage')
  await eyes.check('some tag', Target.window().fully())
  await eyes.close()
})
