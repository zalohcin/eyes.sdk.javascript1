/* eslint-disable no-unused-vars */
/* global fixture */

'use strict'

const {Configuration, StitchMode} = require('@applitools/eyes-common')
const {Eyes, Target, ConsoleLogHandler} = require('../..')

/*
 * Play with configuration and test :
 */

const eyes = new Eyes()
const configuration = new Configuration({
  stitchMode: StitchMode.CSS,
  stitchOverlap: 56,
  viewportSize: {width: 1024, height: 768},
})
eyes.setConfiguration(configuration)

if (process.env.APPLITOOLS_SHOW_LOGS || process.env.LIVE) {
  eyes.setLogHandler(new ConsoleLogHandler(true))
}

fixture`Play`.page`https://www.apple.com/apple-watch-series-3/`

// test('Play', async t => {
//   await eyes.open(t, 'Play Testcafe', 'play testcafe')
//   // await eyes._scanPage()
//   await eyes.check('page play', Target.window().fully())
//   const result = await eyes.close(false)
//   console.log('Play result', result)
// })

test('Play', async t => {
  // const captureFrameAndPollForIE = require('../../dist/captureFrameAndPollForIE')
  // const {TestCafeExecutor} = require('../../lib/TestCafeExecutor')
  // const ex = new TestCafeExecutor(t)
  // console.log('XXXXXXXXX: captureFrameAndPollForIE', captureFrameAndPollForIE.toString())
  // const r = await ex.executeScript(captureFrameAndPollForIE)
  // const r2 = await ex.executeScript(captureFrameAndPollForIE)
  // console.log('XXXXXXXXX: r', r2)

  await t.resizeWindow(600, 500)
  const name = new Date().toISOString().replace(/:/g, '_')
  const image = await t.takeScreenshot(`./render-${name}.png`)
  console.log('XXXXXXXXX: image', image)
})
