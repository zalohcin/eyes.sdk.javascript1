/* global fixture */

'use strict'

const {Configuration, StitchMode} = require('@applitools/eyes-common')
const {Eyes, Target, ConsoleLogHandler} = require('../..')

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

fixture`apple-tv-hd`.page`https://www.apple.com/shop/buy-tv/apple-tv-hd/32gb`.after(
  async () => await eyes.close(),
)

test('apple-tv-hd', async t => {
  await eyes.open(t, 'apple-tv-hd', 'apple-tv-hd')
  await eyes.check('apple-tv-hd', Target.window().fully())
})
