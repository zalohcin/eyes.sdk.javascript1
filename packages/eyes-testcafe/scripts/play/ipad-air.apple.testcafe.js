/* global fixture */

'use strict'

const {Configuration, StitchMode} = require('@applitools/eyes-common')
const {Eyes, Target, ConsoleLogHandler} = require('../..')

const eyes = new Eyes()
const configuration = new Configuration({
  stitchMode: StitchMode.SCROLL,
  stitchOverlap: 56,
  viewportSize: {width: 1024, height: 768},
})
eyes.setConfiguration(configuration)

if (process.env.APPLITOOLS_SHOW_LOGS || process.env.LIVE) {
  eyes.setLogHandler(new ConsoleLogHandler(true))
}

fixture`ipad-air`.page`https://www.apple.com/ipad-air/`.after(async () => await eyes.close())

test('ipad-air', async t => {
  await eyes.open(t, 'ipad-air', 'ipad-air')
  await eyes.check('ipad-air', Target.window().fully())
})
