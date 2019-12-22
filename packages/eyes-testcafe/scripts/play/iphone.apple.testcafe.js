/* global fixture */

'use strict'

const {Configuration, StitchMode} = require('@applitools/eyes-common')
const {Eyes, Target, ConsoleLogHandler} = require('../..')

const eyes = new Eyes()
const configuration = new Configuration({
  stitchMode: StitchMode.CSS,
  viewportSize: {width: 1024, height: 768},
})
eyes.setConfiguration(configuration)

if (process.env.APPLITOOLS_SHOW_LOGS || process.env.LIVE) {
  eyes.setLogHandler(new ConsoleLogHandler(true))
}

fixture`Apple IPhone`.page`https://www.apple.com/iphone/`.after(async () => await eyes.close())

test('Apple IPhone', async t => {
  await eyes.open(t, 'Apple iphone', 'Apple iphone page')

  await new Promise(r => setTimeout(r, 2000))
  await eyes.check('Login', Target.window().fully())
})
