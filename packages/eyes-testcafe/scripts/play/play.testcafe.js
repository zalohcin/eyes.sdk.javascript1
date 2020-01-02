/* global fixture */

'use strict'

const {Configuration, StitchMode} = require('@applitools/eyes-common')
const {Eyes, Target, ConsoleLogHandler} = require('../..')

/*
 * Play with configuration and test :
 */

const eyes = new Eyes()
const configuration = new Configuration({
  stitchMode: StitchMode.SCROLL,
  viewportSize: {width: 600, height: 500},
})
eyes.setConfiguration(configuration)

if (process.env.APPLITOOLS_SHOW_LOGS || process.env.LIVE) {
  eyes.setLogHandler(new ConsoleLogHandler(true))
}

fixture`Play`.page`https://applitools.com/helloworld`

test('Play', async t => {
  await eyes.open(t, 'Play Testcafe', 'play testcafe')
  await eyes.check('page play', Target.window().fully())
  const result = await eyes.close()
  console.log('Play result', result)
})

// test('Play', async t => {
//   // await t.resizeWindow(600, 500)
//   // await new Promise(r => setTimeout(r, 1000))

//   const captureFrameAndPollForIE = require('../../dist/captureFrameAndPollForIE')
//   const {TestCafeJavaScriptExecutor} = require('../../lib/TestCafeJavaScriptExecutor')
//   const ex = new TestCafeJavaScriptExecutor(t)

//   console.log('XXXXXXXXX: captureFrameAndPollForIE', captureFrameAndPollForIE.toString())
//   const r = await ex.executeScript(captureFrameAndPollForIE)
//   const r2 = await ex.executeScript(captureFrameAndPollForIE)
//   console.log('XXXXXXXXX: r', r2)

//   // await t.eval(() => (document.documentElement.style.transform = 'translate(-0px, -0px)'))
//   // const name = new Date().toISOString().replace(/:/g, '_')
//   // const image = await t.takeScreenshot(`./render-${name}.png`)
// })
