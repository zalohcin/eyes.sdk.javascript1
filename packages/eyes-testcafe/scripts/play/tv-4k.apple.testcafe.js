/* global fixture */

'use strict'

const {Configuration, StitchMode} = require('@applitools/eyes-common')
const {Eyes, Target, ConsoleLogHandler} = require('../..')

const eyes = new Eyes()
const configuration = new Configuration({
  stitchMode: StitchMode.SCROLL,
  stitchOverlap: 56,
  waitBeforeScreenshots: 6000,
  viewportSize: {width: 1024, height: 768},
})
eyes.setConfiguration(configuration)

if (process.env.APPLITOOLS_SHOW_LOGS || process.env.LIVE) {
  eyes.setLogHandler(new ConsoleLogHandler(true))
}

fixture`apple-tv-4k`.page`https://www.apple.com/apple-tv-4k/`.after(async () => await eyes.close())

test('apple-tv-4k', async t => {
  await eyes.open(t, 'apple-tv-4k', 'apple-tv-4k')
  await eyes.check('apple-tv-4k', Target.window().fully())
})
