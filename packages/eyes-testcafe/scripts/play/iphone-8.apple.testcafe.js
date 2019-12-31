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

// PAGE MESSED UP WITH SDK
fixture.skip`iphone-8`.page`https://www.apple.com/shop/buy-iphone/iphone-8`.after(
  async () => await eyes.close(),
)

test('iphone-8', async t => {
  await eyes.open(t, 'iphone-8', 'iphone-8')
  await eyes.check('iphone-8', Target.window().fully())
})
