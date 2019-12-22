/* global fixture */

'use strict'

const {Configuration, StitchMode} = require('@applitools/eyes-common')
const {Eyes, Target, ConsoleLogHandler} = require('../../../..')

fixture`Hello world full page Safari`.page`https://www.applitools.com/helloworld`

test('helloworld full page Safari', async t => {
  const eyes = new Eyes()
  eyes.setConfiguration(new Configuration({viewportSize: {width: 600, height: 500}}))
  if (process.env.APPLITOOLS_SHOW_LOGS || process.env.APPLITOOLS_DEBUG_TEST) {
    eyes.setLogHandler(new ConsoleLogHandler(true))
  }
  await eyes.open(t, 'Applitools helloworld', 'eyes-testcafe e2e - fullpage')
  await eyes.check('some tag', Target.window().fully())
  await eyes.close()
})

/*
 * BROWSER SATCK or testcafe-browser-provider-browserstack BUG - Tetscafe failing to take snapshot:
 * RangeError [ERR_OUT_OF_RANGE]: The value of "sourceStart" is out of range. It must be >= 0. Received -456000
 */
test.skip('full page css stiching Safari', async t => {
  const eyes = new Eyes()
  eyes.setConfiguration(
    new Configuration({stitchMode: StitchMode.CSS, viewportSize: {width: 600, height: 500}}),
  )
  if (process.env.APPLITOOLS_SHOW_LOGS || process.env.APPLITOOLS_DEBUG_TEST) {
    eyes.setLogHandler(new ConsoleLogHandler(true))
  }
  await eyes.open(t, 'Applitools helloworld', 'eyes-testcafe e2e - fullpage')
  await eyes.check('some tag', Target.window().fully())
  await eyes.close()
})
