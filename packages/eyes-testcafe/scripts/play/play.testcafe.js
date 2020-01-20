/* eslint-disable no-unused-vars */
/* global fixture */

'use strict'

const {
  Eyes,
  Target,
  ConsoleLogHandler,
  FileDebugScreenshotsProvider,
  Configuration,
  StitchMode,
} = require('../../index')

/*
 * Play with configuration and test :
 */

const eyes = new Eyes()
const configuration = new Configuration({
  stitchMode: StitchMode.CSS,
  // stitchOverlap: 56,
  viewportSize: {width: 600, height: 500},
})

// const debugHandler = new FileDebugScreenshotsProvider()
// debugHandler.setPath('./screenshots')
// eyes.setDebugScreenshotsProvider(debugHandler)
eyes.setConfiguration(configuration)

if (process.env.APPLITOOLS_SHOW_LOGS || process.env.LIVE) {
  eyes.setLogHandler(new ConsoleLogHandler(true))
}

fixture`Play`.page`http://localhost:8080/full-page.html`
test('Play', async t => {
  await eyes.open(t, 'Play Testcafe', 'play testcafe')
  // await eyes._scanPage()
  await eyes.check('page play', Target.window().fully())
  const result = await eyes.close(false)
  console.log('Play result', result)
})

// test('Play', async t => {
//   // const captureFrameAndPollForIE = require('../../dist/captureFrameAndPollForIE')
//   // const {TestCafeExecutor} = require('../../lib/TestCafeExecutor')
//   // const ex = new TestCafeExecutor(t)
//   // console.log('XXXXXXXXX: captureFrameAndPollForIE', captureFrameAndPollForIE.toString())
//   // const r = await ex.executeScript(captureFrameAndPollForIE)
//   // const r2 = await ex.executeScript(captureFrameAndPollForIE)
//   // console.log('XXXXXXXXX: r', r2)

//   await t.resizeWindow(600, 500)
//   const fixImageMarkScript = require('../../lib/positioning/fixImageMarkScript')
//   const fixMarkScript = fixImageMarkScript(-600, 0)
//   const script = `${fixMarkScript}; document.documentElement.style.transform = 'translate(-600px, 0px)';`
//   await t.eval(new Function(script))

//   const name = new Date().toISOString().replace(/:/g, '_')
//   const image = await t.takeScreenshot(`./render-${name}.png`)
//   console.log('XXXXXXXXX: image', image)
// })
