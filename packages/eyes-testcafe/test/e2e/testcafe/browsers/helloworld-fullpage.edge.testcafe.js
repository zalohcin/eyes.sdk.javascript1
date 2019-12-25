/* global fixture */

'use strict'

const {Configuration, StitchMode} = require('@applitools/eyes-common')
const {Eyes, Target, ConsoleLogHandler} = require('../../../..')

fixture`Hello world full page Edge`.page`https://www.applitools.com/helloworld`

test('helloworld full page Edg', async t => {
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
 * BUG - Tetscafe failing to take snapshot:
 * https://github.com/DevExpress/testcafe/issues/4600
 */
test.skip('full page css stiching Edge', async t => {
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
