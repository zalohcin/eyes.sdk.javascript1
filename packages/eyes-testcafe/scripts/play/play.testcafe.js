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

fixture`Play`.page`https://www.apple.com/macbook-air/`

test('Play', async t => {
  await eyes.open(t, 'Play Testcafe', 'play testcafe')
  await eyes._scanPage()
  await eyes.check('page play', Target.window().fully())
  const result = await eyes.close(false)
  console.log('Play result', result)
})

// test('Play', async t => {
//   await t.resizeWindow(1024, 768)
//   // await new Promise(r => setTimeout(r, 1000))

//   // const captureFrameAndPollForIE = require('../../dist/captureFrameAndPollForIE')
//   // const {TestCafeJavaScriptExecutor} = require('../../lib/TestCafeJavaScriptExecutor')
//   // const ex = new TestCafeJavaScriptExecutor(t)

//   // console.log('XXXXXXXXX: captureFrameAndPollForIE', captureFrameAndPollForIE.toString())
//   // const r = await ex.executeScript(captureFrameAndPollForIE)
//   // const r2 = await ex.executeScript(captureFrameAndPollForIE)
//   // console.log('XXXXXXXXX: r', r2)

//   const top = 0
//   const left = -655
//   const opt = {dependencies: {top, left}}
//   await t.eval(
//     () => (document.documentElement.style.transform = `translate(${left}px, ${top}px)`),
//     opt,
//   )

//   const fixTestcafeMark = `
//     const h = document.documentElement.getBoundingClientRect().height
//     const styleContent = \`img.screenshot-mark-hammerhead-shadow-ui { 
//       bottom: calc(\${h\}px - 100vh + ${top}px) !important;
//       top: auto !important;
//       left: auto !important;
//       right: calc(5px + ${left}px) !important;
//     }\`
//     let style = document.getElementById('applitools-mark-fix')
//     if(!style) {
//       style = document.createElement('style')
//       style.id = 'applitools-mark-fix'
//       document.body.appendChild(style);
//     }
//     style.innerText = styleContent
//   `

//   const newTestcafeMarkStyle = new Function(fixTestcafeMark)
//   await t.eval(newTestcafeMarkStyle)

//   const name = new Date().toISOString().replace(/:/g, '_')
//   const image = await t.takeScreenshot(`./render-${name}.png`)
//   console.log('XXXXXXXXX: image', image)

//   const index = await t.eval(() => document.body.children.length)
//   const rect = await t.eval(new Function(`return document.body.children[${index}].children[1].getBoundingClientRect().toJSON()`))
//   console.log('XXXXXXXXX: rect', rect)
// })
