/* global fixture */

'use strict'

const {Configuration, StitchMode} = require('@applitools/eyes-common')
const {Eyes, Target, ConsoleLogHandler} = require('../../..')

fixture`Hello world full page`.page`https://applitools.github.io/demo/TestPages/FramesTestPage/` // eslint-disable-line no-unused-expressions

test('css stiching', async t => {
  // fiale since original looks bad..
  const eyes = new Eyes()
  const configuration = new Configuration({viewportSize: {width: 600, height: 500}})
  eyes.setStitchMode(StitchMode.SCROLL)
  eyes.setConfiguration(configuration)

  if (process.env.APPLITOOLS_SHOW_LOGS || process.env.APPLITOOLS_DEBUG_TEST) {
    eyes.setLogHandler(new ConsoleLogHandler(true))
  }

  await eyes.open(t, 'Check CSS Stitching', 'with check window')
  await eyes.check('Window', Target.window().fully())
  await eyes.close()
})
