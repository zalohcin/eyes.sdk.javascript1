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

fixture`Play`.page`https://www.apple.com/macbook-air/`

// test('Play', async t => {
//   await eyes.open(t, 'Play Testcafe', 'play testcafe')
//   await eyes.check('page play', Target.window().fully())
//   const result = await eyes.close()
//   console.log('Play result', result)
// })

test('Play', async t => {
  // await t.resizeWindow(600, 500)
  // await new Promise(r => setTimeout(r, 1000))

  // const captureFrameAndPollForIE = require('../../dist/captureFrameAndPollForIE')
  // const {TestCafeJavaScriptExecutor} = require('../../lib/TestCafeJavaScriptExecutor')
  // const ex = new TestCafeJavaScriptExecutor(t)

  // console.log('XXXXXXXXX: captureFrameAndPollForIE', captureFrameAndPollForIE.toString())
  // const r = await ex.executeScript(captureFrameAndPollForIE)
  // const r2 = await ex.executeScript(captureFrameAndPollForIE)
  // console.log('XXXXXXXXX: r', r2)

  const top = 50
  const left = 20
  const opt = {dependencies: {top, left}}
  await t.eval(
    () => (document.documentElement.style.transform = `translate(${left}px, ${top}px)`),
    opt,
  )

  const bannerIndex = await t.eval(() => document.body.children.length)
  opt.dependencies.bannerIndex = bannerIndex
  console.log('XXXXXXXXX: bannerIndex', bannerIndex)

  const setBannerStyle = new Function(`
    const testCafeBanner = document.body.children[${bannerIndex}].firstChild.firstChild
    testCafeBanner.style.setProperty('top', 'calc(100vh - 52px - 15px - ${top}px)')
    testCafeBanner.style.setProperty('bottom', 'auto')
    testCafeBanner.style.setProperty('left', '-${left}px')
  `)
  await t.eval(setBannerStyle, opt)

  const name = new Date().toISOString().replace(/:/g, '_')
  const image = await t.takeScreenshot(`./render-${name}.png`)
  console.log('XXXXXXXXX: image', image)
})
