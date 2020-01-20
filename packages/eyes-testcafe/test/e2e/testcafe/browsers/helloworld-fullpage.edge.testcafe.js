/* global fixture */

'use strict'

const {Configuration, StitchMode, Eyes, Target, ConsoleLogHandler} = require('../../../../index')

fixture`full page Edge`.page`http://localhost:5556/full-page.html`

test('full page Edge', async t => {
  const eyes = new Eyes()
  eyes.setConfiguration(new Configuration({viewportSize: {width: 600, height: 500}}))
  if (process.env.APPLITOOLS_SHOW_LOGS || process.env.APPLITOOLS_DEBUG_TEST) {
    eyes.setLogHandler(new ConsoleLogHandler(true))
  }
  await eyes.open(t, 'Applitools full page Edge', 'eyes-testcafe e2e - fullpage')
  await eyes.check('some tag', Target.window().fully())
  await eyes.close()
})

test('full page css stiching Edge', async t => {
  const eyes = new Eyes()
  eyes.setConfiguration(
    new Configuration({stitchMode: StitchMode.CSS, viewportSize: {width: 600, height: 500}}),
  )
  if (process.env.APPLITOOLS_SHOW_LOGS || process.env.APPLITOOLS_DEBUG_TEST) {
    eyes.setLogHandler(new ConsoleLogHandler(true))
  }
  await eyes.open(t, 'Applitools full page Edge', 'eyes-testcafe e2e - fullpage')
  await eyes.check('some tag', Target.window().fully())
  await eyes.close()
})
