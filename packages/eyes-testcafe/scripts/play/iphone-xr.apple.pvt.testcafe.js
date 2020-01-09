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

// TESTCAFE CANT OPEN PAGE
fixture.skip`iphone-xr`.page`https://www.apple.com/shop/buy-iphone/iphone-xr`.after(
  async () => await eyes.close(),
)

test('iphone-xr', async t => {
  await eyes.open(t, 'iphone-xr', 'iphone-xr')
  await eyes.check('iphone-xr', Target.window().fully())
})
