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
  viewportSize: {width: 1024, height: 768},
})
eyes.setConfiguration(configuration)

if (process.env.APPLITOOLS_SHOW_LOGS || process.env.LIVE) {
  eyes.setLogHandler(new ConsoleLogHandler(true))
}

fixture`Play`.page`https://google.com`

test('Play', async t => {
  await new Promise(r => setTimeout(r, 1000))
  await eyes.open(t, 'Play Testcafe', 'play testcafe')
  await eyes.check('page play', Target.window().fully())
  const result = await eyes.close()
  console.log('XXXXXXXXX: r', result)
})

// test('Play', async t => {
//   // await t.resizeWindow(600, 500)
//   await new Promise(r => setTimeout(r, 1000))

//   // await t.eval(() => (document.documentElement.style.transform = 'translate(-0px, -0px)'))
//   const r = await t.eval(() => {
//     var activeElement = document.activeElement
//     activeElement && activeElement.blur()
//     return activeElement
//   })

//   // const name = new Date().toISOString().replace(/:/g, '_')
//   // const image = await t.takeScreenshot(`./render-${name}.png`)
//   console.log('XXXXXXXXX: path', r)
// })
